import { Pool } from 'pg';
import { Monitor } from '../../model/Monitor';
import uuidv4 from 'uuid';

export class MonitorQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listMonitors = async (projectId: string): Promise<Monitor[]> => {
		const { rows } = await this.pool.query({
			text: 'SELECT id, name, query FROM monitors WHERE project_id = $1',
			values: [projectId],
		});
		return rows.map(row => new Monitor(row['id'], row['name'], row['query']));
	};

	getMonitor = async (id: string): Promise<Monitor> => {
		const { rows } = await this.pool.query({
			text: 'SELECT id, name, query FROM monitors WHERE id = $1',
			values: [id],
		});

		return new Monitor(rows[0]['id'], rows[0]['name'], rows[0]['query']);
	};

	insertMonitor = async (
		projectId: string,
		name: string,
		query: string
	): Promise<void> => {
		// TODO permissions check!!
		await this.pool.query({
			text:
				'INSERT INTO monitors (id, project_id, name, query, count) VALUES ($1, $2, $3, $4, 0)',
			values: [uuidv4(), projectId, name, query],
		});

		return;
	};
}
