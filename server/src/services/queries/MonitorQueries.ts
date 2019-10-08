import { Pool } from 'pg';
import { Monitor } from '../../model/Monitor';
import uuidv4 from 'uuid';

export class MonitorQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listMonitors = async (): Promise<Monitor[]> => {
		const { rows } = await this.pool.query(
			'SELECT id, name, query FROM monitors'
		);
		return rows.map(row => new Monitor(row['id'], row['name'], row['query']));
	};

	getMonitor = async (id: string): Promise<Monitor> => {
		const { rows } = await this.pool.query({
			text: 'SELECT id, name, query FROM monitors WHERE id = $1',
			values: [id],
		});

		return new Monitor(rows[0]['id'], rows[0]['name'], rows[0]['query']);
	};

	insertMonitor = async (name: string, query: string): Promise<void> => {
		// TODO permissions check!!
		await this.pool.query({
			text: 'INSERT INTO monitors (id, name, query) VALUES ($1, $2, $3)',
			values: [uuidv4(), name, query],
		});

		return;
	};
}
