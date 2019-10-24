import { Pool } from 'pg';
import { Monitor } from '@guardian/ferret-common';
import uuidv4 from 'uuid';
import { transactionally } from './helpers';

export class MonitorQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listMonitors = async (pId: string): Promise<Monitor[]> => {
		const { rows } = await this.pool.query({
			text: 'SELECT id, title, query FROM monitors WHERE project_id = $1',
			values: [pId],
		});
		return rows.map(row => ({
			id: row['id'],
			title: row['title'],
			query: row['query'],
		}));
	};

	getMonitor = async (id: string): Promise<Monitor> => {
		const { rows } = await this.pool.query({
			text: 'SELECT id, title, query FROM monitors WHERE id = $1',
			values: [id],
		});

		return {
			id: rows[0]['id'],
			title: rows[0]['title'],
			query: rows[0]['query'],
		};
	};

	getMonitorTweets = async (id: string): Promise<any[]> => {
		// TODO confirm this join works well with indices
		const { rows } = await this.pool.query({
			text: `
			SELECT tweets.tweet FROM monitors
			 INNER JOIN monitor_tweets ON monitors.id = monitor_tweets.monitor_id
			 INNER JOIN tweets ON monitor_tweets.tweet_id = tweets.id
			 WHERE monitors.id = $1`,
			values: [id],
		});

		return rows.map(r => r['tweet']);
	};

	insertTweetForMonitor = async (mId: string, tweet: any): Promise<void> => {
		transactionally(this.pool, async client => {
			await client.query({
				text:
					'INSERT INTO tweets (id, tweet) VALUES ($1, $2) ON CONFLICT DO NOTHING',
				values: [tweet.id_str, tweet],
			});

			await client.query({
				text:
					'INSERT INTO monitor_tweets (monitor_id, tweet_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
				values: [mId, tweet.id_str],
			});
		});
	};

	updateMonitorProgress = async (
		id: string,
		sinceId: string,
		updatedAt: number,
		newTotalCount: number // Explictly the new total, not a diff
	): Promise<void> => {
		await this.pool.query({
			text:
				'UPDATE monitors SET since_id = $1, last_updated = $2, count = $3 WHERE id = $4',
			values: [sinceId, updatedAt, newTotalCount, id],
		});

		return;
	};

	insertMonitor = async (
		pId: string,
		title: string,
		query: string
	): Promise<void> => {
		await this.pool.query({
			text:
				'INSERT INTO monitors (id, project_id, title, query, count) VALUES ($1, $2, $3, $4, 0)',
			values: [uuidv4(), pId, title, query],
		});

		return;
	};
}
