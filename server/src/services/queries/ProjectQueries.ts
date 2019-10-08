import { Pool } from 'pg';
import { Project } from '../../model/Project';
import uuidv4 from 'uuid';

export class ProjectQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listProjects = async (): Promise<Project[]> => {
		const { rows } = await this.pool.query(
			'SELECT id, name, image FROM projects'
		);
		return rows.map(row => new Project(row['id'], row['name'], row['image']));
	};

	insertProject = async (
		name: string,
		image: string,
		userId: string
	): Promise<void> => {
		await this.pool.query({
			text:
				'INSERT INTO projects (id, name, image, created_by, created_on) VALUES ($1, $2, $3, $4, NOW())',
			values: [uuidv4(), name, image, userId],
		});

		return;
	};
}
