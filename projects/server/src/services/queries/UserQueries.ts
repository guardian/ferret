import { hashPassword } from '../Auth';
import { ServerUser } from '../../model/ServerUser';
import { Pool } from 'pg';
import uuidv4 from 'uuid';
import { User, Permission } from '@guardian/ferret-common';
import { transactionally } from './helpers';

export class UserQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listUsers = async (): Promise<User[]> => {
		const { rows } = await this.pool.query(
			`SELECT id, username, display_name, permission
			 FROM users
			 JOIN user_permissions ON user_id = id`
		);

		return rows.map(row => {
			const permissions = rows
				.filter(r => r.id === row.id)
				.map(r => r.permission);

			return {
				id: row['id'],
				username: row['username'],
				displayName: row['display_name'],
				permissions,
			};
		});
	};

	getUser = async (id: string): Promise<ServerUser> => {
		const { rows } = await this.pool.query({
			text: `SELECT id, username, display_name, password 
					FROM users 
					LEFT JOIN user_permissions ON user_id = $1
					WHERE id = $1`,
			values: [id],
		});

		return new ServerUser(
			rows[0]['id'],
			rows[0]['username'],
			rows[0]['display_name'],
			rows[0]['password'],
			rows.map(r => r.permission)
		);
	};

	getUserByUsername = async (
		username: string
	): Promise<ServerUser | undefined> => {
		const { rows } = await this.pool.query({
			text: `SELECT id, username, display_name, password, permission
				 FROM users 
				 LEFT JOIN user_permissions ON user_id = id
				 WHERE username = $1`,
			values: [username],
		});

		if (rows.length > 0) {
			return new ServerUser(
				rows[0]['id'],
				rows[0]['username'],
				rows[0]['display_name'],
				rows[0]['password'],
				rows.map(r => r.permission)
			);
		}

		return undefined;
	};

	insertUser = async (
		username: string,
		displayName: string,
		plainTextPassword: string,
		initialPermissions: Permission[]
	): Promise<void> => {
		const hashedPassword: string = await hashPassword(plainTextPassword);

		const id = uuidv4();
		transactionally(this.pool, async client => {
			await client.query({
				text:
					'INSERT INTO users (id, username, display_name, password) VALUES ($1, $2, $3, $4)',
				values: [id, username, displayName, hashedPassword],
			});

			for (let i = 0; i < initialPermissions.length; i++) {
				await client.query({
					text: `INSERT INTO user_permissions (user_id, permission) VALUES ($1, $2)`,
					values: [id, initialPermissions[i]],
				});
			}
		});

		return;
	};

	updateSetting = async (userId: string, settings: object): Promise<void> => {
		// TODO prove the current user is the same as userId
		await this.pool.query({
			text: 'UPDATE users SET settings = settings || $1 WHERE id = $2',
			values: [settings, userId],
		});

		return;
	};
}
