import { Pool, Client } from 'pg';
import {
	Feed,
	FeedParameters,
	FeedType,
	FeedJobStatus,
	FeedJob,
} from '@guardian/ferret-common';
import uuidv4 from 'uuid';
import { transactionally } from './helpers';
import parser from 'cron-parser';

export class FeedQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listFeeds = async (userId: string): Promise<Feed[]> => {
		const { rows } = await this.pool.query({
			text: `SELECT id, title, type, frequency, parameters, dataset_id
			FROM feeds 
			INNER JOIN user_feeds ON feed_id = feeds.id
			WHERE user_id = $1`,
			values: [userId],
		});

		return rows.map(row => ({
			id: row['id'],
			title: row['title'],
			type: row['type'],
			frequency: row['frequency'],
			parameters: row['parameters'],
			datasetId: row['dataset_id'],
		}));
	};

	getFeed = async (id: string, userId: string): Promise<Feed> => {
		const { rows } = await this.pool.query({
			text: `SELECT id, title, type, frequency, parameters, dataset_id
			FROM feeds 
			INNER JOIN user_feeds ON feed_id = feeds.id
			WHERE feeds.id = $1 AND user_id = $2`,
			values: [id, userId],
		});

		return {
			id: rows[0]['id'],
			title: rows[0]['title'],
			datasetId: rows[0]['dataset_id'],
			type: rows[0]['type'],
			frequency: rows[0]['frequency'],
			parameters: rows[0]['parameters'],
		};
	};

	getFeedForService = async (id: string): Promise<Feed> => {
		const { rows } = await this.pool.query({
			text: `SELECT id, title, type, frequency, parameters, datset_id
			FROM feeds 
			WHERE feeds.id = $1`,
			values: [id],
		});

		return {
			id: rows[0]['id'],
			title: rows[0]['title'],
			datasetId: rows[0]['dataset_id'],
			type: rows[0]['type'],
			frequency: rows[0]['frequency'],
			parameters: rows[0]['parameters'],
		};
	};

	insertFeed = async (
		userId: string,
		title: string,
		type: FeedType,
		frequency: string,
		parameters: FeedParameters
	): Promise<void> => {
		return transactionally(this.pool, async client => {
			const datasetId = uuidv4();
			const feedId = uuidv4();

			await client.query({
				text: `INSERT INTO datasets (id, title, type) VALUES ($1, $2, 'feed')`,
				values: [datasetId, title],
			});

			await client.query({
				text: `INSERT INTO user_datasets (user_id, dataset_id) VALUES ($1, $2)`,
				values: [userId, datasetId],
			});

			await client.query({
				text: `INSERT INTO feeds (id, dataset_id,  title, type, frequency, parameters, created_by, created_on) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
				values: [feedId, datasetId, title, type, frequency, parameters, userId],
			});

			await client.query({
				text: `INSERT INTO user_feeds (user_id, feed_id, access_level) VALUES ($1, $2, 'admin')`,
				values: [userId, feedId],
			});

			await client.query({
				text: `INSERT INTO feed_jobs (id, feed_id, start_on, run_on, status) VALUES ($1, $2, NOW(), NOW(), 'ready')`,
				values: [uuidv4(), feedId],
			});
		});
	};

	getReadyJobs = async (): Promise<FeedJob[]> => {
		return transactionally(this.pool, async client => {
			const { rows: jobRows } = await client.query({
				text: `UPDATE feed_jobs 
					SET status = 'processing', last_heartbeat_on = NOW()
					WHERE id = (
						SELECT id FROM feed_jobs
						WHERE status = 'ready' AND run_on < NOW()
						FOR UPDATE SKIP LOCKED
						LIMIT $1
					) 
					RETURNING id, feed_id, start_on, run_on, status`,
				values: [1],
			});

			const jobs = [];

			for (let i = 0; i < jobRows.length; i++) {
				const row = jobRows[i];
				const feedId = row['feed_id'];

				const { rows: feedRows } = await client.query({
					text: `SELECT * FROM feeds WHERE id = $1`,
					values: [feedId],
				});

				jobs.push({
					jobId: row['id'],
					status: row['status'],
					addedOn: row['start_on'],
					feed: {
						id: feedRows[0]['id'],
						title: feedRows[0]['title'],
						datasetId: feedRows[0]['dataset_id'],
						type: feedRows[0]['type'],
						frequency: feedRows[0]['frequency'],
						parameters: feedRows[0]['parameters'],
					},
				});
			}

			return jobs;
		});
	};

	heartbeatJob = (jobId: string) => {
		return this.pool.query({
			text: `UPDATE feed_jobs SET last_heartbeat_on = NOW() WHERE id = $1`,
			values: [jobId],
		});
	};

	updateFeedJob = async (
		jobId: string,
		status: FeedJobStatus,
		jobProcessedOn: string
	): Promise<void> => {
		return transactionally(this.pool, async client => {
			const { rows } = await client.query({
				text: `UPDATE feed_jobs SET status = $1 WHERE id = $2 RETURNING feed_id, start_on`,
				values: [status, jobId],
			});

			const feed = await this.getFeedForService(rows[0]['feed_id']);

			const newAddedOn =
				status === 'done' ? jobProcessedOn : rows[0]['start_on'];

			const nextScheduledJob = parser
				.parseExpression(feed.frequency)
				.next()
				.toISOString();

			await client.query({
				text: `INSERT INTO feed_jobs (id, feed_id, start_on, run_on, status) VALUES ($1, $2, $3, $4, 'ready')`,
				values: [uuidv4(), feed.id, newAddedOn, nextScheduledJob],
			});
		});
	};
}
