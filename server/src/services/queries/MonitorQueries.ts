import { Pool } from 'pg';
import { Monitor } from '../../model/Monitor';
import uuidv4 from 'uuid';

export class MonitorQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listMonitors = async (pId: string): Promise<Monitor[]> => {
		const { rows } = await this.pool.query({
			text: 'SELECT id, name, query FROM monitors WHERE project_id = $1',
			values: [pId],
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

	updateMonitorProgress = (
		id: string,
		sinceId: string,
		updatedAt: number,
		newTotalCount: number // Explictly the new total, not a diff
	): Promise<any> => {
		return this.pool.query({
			text:
				'UPDATE monitors SET since_id = $1, last_updated = $2, count = $3 WHERE id = $4',
			values: [sinceId, updatedAt, newTotalCount, id],
		});
	};

	insertMonitor = async (
		pId: string,
		name: string,
		query: string
	): Promise<void> => {
		await this.pool.query({
			text:
				'INSERT INTO monitors (id, project_id, name, query, count) VALUES ($1, $2, $3, $4, 0)',
			values: [uuidv4(), pId, name, query],
		});

		return;
	};
}
