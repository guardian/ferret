import { Pool } from 'pg';
import {
	Project,
	Timeline,
	ProjectAccessLevel,
	TimelineEvidence,
	TimelineEntry,
} from '@guardian/ferret-common';
import uuidv4 from 'uuid';
import { transactionally } from './helpers';

export class ProjectQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listProjects = async (uId: string): Promise<Project[]> => {
		const { rows } = await this.pool.query({
			text: `SELECT id, title, image, access_level 
				 FROM user_projects 
				 INNER JOIN projects ON project_id = projects.id
				 WHERE user_id = $1`,
			values: [uId],
		});

		return rows.map(row => ({
			id: row['id'],
			image: row['image'],
			title: row['title'],
			access: row['access_level'],
		}));
	};

	insertProject = async (
		title: string,
		image: string,
		userId: string
	): Promise<void> => {
		return transactionally(this.pool, async client => {
			const projectId = uuidv4();

			await client.query({
				text:
					'INSERT INTO projects (id, title, image, created_by) VALUES ($1, $2, $3, $4)',
				values: [projectId, title, image, userId],
			});

			await client.query({
				text: `INSERT INTO user_projects (user_id, project_id, access_level) VALUES ($1, $2, 'admin')`,
				values: [userId, projectId],
			});

			return;
		});
	};

	getUserPermissionForProject = async (
		uId: string,
		pId: string
	): Promise<ProjectAccessLevel | undefined> => {
		const { rows } = await this.pool.query({
			text:
				'SELECT access_level FROM user_projects WHERE user_id = $1 AND project_id = $2',
			values: [uId, pId],
		});

		if (rows.length > 0) {
			return rows[0]['access_level'];
		} else {
			return undefined;
		}
	};

	listTimelines = async (pId: string): Promise<Timeline[]> => {
		const { rows } = await this.pool.query({
			text: `SELECT id, title, created_by, created_on 
				FROM timelines 
				WHERE project_id = $1`,
			values: [pId],
		});

		return rows.map(row => ({
			id: row['id'],
			title: row['title'],
			createdBy: row['access_level'],
			createdOn: row['access_level'],
		}));
	};

	listTimelineEntries = async (tId: string): Promise<TimelineEntry[]> => {
		const { rows } = await this.pool.query({
			text: `SELECT 
			   timeline_entries.id          as entries_id,
			   timeline_entries.index       as entries_index,
			   timeline_entries.happened_on as entries_happened_on,
			   timeline_entries.title       as entries_title,
			   timeline_entries.description as entries_description,

			   timeline_entry_evidence.type  as evidence_type,
			   timeline_entry_evidence.title as evidence_title,
			   timeline_entry_evidence.data  as evidence_data

			FROM timeline_entries
			LEFT JOIN timeline_entry_evidence ON entry_id = id
			WHERE timeline_entries.timeline_id = $1`,
			values: [tId],
		});

		const entryIds = [...new Set(rows.map(r => r['entries_id']))];

		const entriesWithIndex = entryIds.map(eId => {
			const entry = rows.find(r => r['entries_id'] === eId);

			const evidence: TimelineEvidence[] = rows
				.filter(r => r.id === eId)
				.filter(r => r['evidence_type'] !== null)
				.map(r => ({
					type: r['evidence_type'],
					title: r['evidence_title'],
					data: r['evidence_data'],
				}));
			return {
				index: entry['entries_index'],
				entry: {
					id: entry['entries_id'],
					happenedOn: entry['entries_happened_on'],
					title: entry['entries_title'],
					description: entry['entries_description'],
					evidence,
				},
			};
		});

		return entriesWithIndex.sort((a, b) => a.index - b.index).map(e => e.entry);
	};

	insertTimeline = async (
		userId: string,
		projectId: string,
		title: string
	): Promise<void> => {
		transactionally(this.pool, async client => {
			const timelineId = uuidv4();

			await client.query({
				text:
					'INSERT INTO timelines (id, project_id, title, created_by) VALUES ($1, $2, $3, $4, $5)',
				values: [timelineId, projectId, title, userId],
			});

			await client.query({
				text: `INSERT INTO timeline_entries (id, timeline_id, index, happened_on, title, description) VALUES ($1, $2, 0, NULL, 'New Event', 'Description')`,
				values: [uuidv4(), timelineId],
			});

			// await client.query({
			// 	text: `INSERT INTO files (dataset_id, path, type, blob_id) VALUES ($1, $2, 'timeline', $3)`,
			// 	values: [datasetId, path, fsr.hash],
			// });
			return;
		});
	};

	insertTimelineEntry = async (
		timelineId: string,
		title: string,
		description: string,
		evidence: TimelineEvidence[]
	): Promise<void> => {
		transactionally(this.pool, async client => {
			const id = uuidv4();

			await client.query({
				text: `INSERT INTO timeline_entries (id, timeline_id, index, title, description) (
						SELECT $1, $2, COALESCE(MAX(index) + 1, 0), $3, $4 
						FROM timeline_entries 
						WHERE timeline_id = $2
					)`,
				values: [id, timelineId, title, description],
			});

			for (let i = 0; i < evidence.length; i++) {
				const e = evidence[i];
				await client.query({
					text:
						'INSERT INTO timeline_entry_evidence (entry_id, data) VALUES ($1, $2)',
					values: [id, e],
				});
			}
		});

		return;
	};

	updateTimelineEntry = async (
		entryId: string,
		happenedOn: string | undefined,
		title: string,
		description: string
	): Promise<void> => {
		await this.pool.query({
			text:
				'UPDATE timeline_entries SET happened_on = $1, title = $2, description = $3 WHERE id = $4',
			values: [happenedOn, title, description, entryId],
		});

		return;
	};

	deleteTimelineEntry = async (entryId: string): Promise<void> => {
		await this.pool.query({
			text: 'DELETE FROM timeline_entries WHERE id = $1',
			values: [entryId],
		});

		return;
	};

	reorderTimelineEntries = (ids: string[]): Promise<void> => {
		return transactionally(this.pool, async client => {
			for (let i = 0; i < ids.length; i++) {
				await client.query({
					text: `UPDATE timeline_entries SET index = $1 WHERE id = $2`,
					values: [i, ids[i]],
				});
			}
			return;
		});
	};
}
