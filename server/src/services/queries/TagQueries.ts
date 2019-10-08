import { Pool } from 'pg';
import { Project } from '../../model/Project';
import uuidv4 from 'uuid';
import { Tag } from '../../model/Tag';

export class TagQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listTags = async (): Promise<Tag[]> => {
		const { rows } = await this.pool.query('SELECT id, label, color FROM tags');
		return rows.map(row => new Tag(row['id'], row['label'], row['color']));
	};

	insertTag = async (label: string, color: string): Promise<void> => {
		await this.pool.query({
			text: 'INSERT INTO tags (label, color) VALUES ($1, $2)',
			values: [label, color],
		});

		return;
	};
}
