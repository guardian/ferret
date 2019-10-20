import { Pool } from 'pg';
import { Project } from '@guardian/ferret-common';
import uuidv4 from 'uuid';
import { transactionally } from './helpers';

export class ProjectQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listProjects = async (): Promise<Project[]> => {
		// TODO apply permissions checks
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
		return transactionally(this.pool, async client => {
			const projectId = uuidv4();

			await client.query({
				text:
					'INSERT INTO projects (id, name, image, created_by) VALUES ($1, $2, $3, $4)',
				values: [projectId, name, image, userId],
			});

			await client.query({
				text: `INSERT INTO user_projects (user_id, project_id, access_level) VALUES ($1, $2, 'admin')`,
				values: [userId, projectId],
			});

			return;
		});
	};

	canUserSeeProject = async (uId: string, pId: string): Promise<boolean> => {
		const { rows } = await this.pool.query({
			text:
				'SELECT * FROM user_projects WHERE user_id = $1 AND project_id = $2',
			values: [uId, pId],
		});

		return rows.length > 0;
	};

	canUserEditProject = async (uId: string, pId: string): Promise<boolean> => {
		const { rows } = await this.pool.query({
			text: `SELECT * FROM user_projects WHERE user_id = $1 AND project_id = $2 AND (access_level = 'read' OR access_level = 'admin')`,
			values: [uId, pId],
		});

		return rows.length > 0;
	};

	canUserAdministrateProject = async (
		uId: string,
		pId: string
	): Promise<boolean> => {
		const { rows } = await this.pool.query({
			text: `SELECT * FROM user_projects WHERE user_id = $1 AND project_id = $2 AND access_level = 'admin'`,
			values: [uId, pId],
		});

		return rows.length > 0;
	};

	listTimelines = async (): Promise<Project[]> => {
		// TODO access control
		const { rows } = await this.pool.query(
			'SELECT id, name, created_by, created_on FROM timelines'
		);
		return rows.map(row => new Project(row['id'], row['name'], row['image']));
	};

	insertTimeline = async (name: string, userId: string): Promise<void> => {
		// TODO access control
		await this.pool.query({
			text: 'INSERT INTO timelines (id, name, created_by) VALUES ($1, $2, $3)',
			values: [uuidv4(), name, userId],
		});

		return;
	};
}
