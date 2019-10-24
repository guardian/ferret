import { Pool } from 'pg';
import { Tag } from '../../model/Tag';

export class TagQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listTags = async (): Promise<Tag[]> => {
		const { rows } = await this.pool.query('SELECT id, label, color FROM tags');
		return rows.map(row => ({
			id: row['id'],
			label: row['label'],
			color: row['color'],
		}));
	};

	insertTag = async (label: string, color: string): Promise<void> => {
		await this.pool.query({
			text: 'INSERT INTO tags (label, color) VALUES ($1, $2)',
			values: [label, color],
		});

		return;
	};
}
