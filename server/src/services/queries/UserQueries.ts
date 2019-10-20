import { hashPassword } from '../LocalAuth';
import { ServerUser } from '../../model/ServerUser';
import { Pool } from 'pg';
import uuidv4 from 'uuid';
import { User } from '@guardian/ferret-common';

export class UserQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listUsers = async (): Promise<User[]> => {
		const { rows } = await this.pool.query(
			'SELECT id, username, display_name FROM users'
		);

		return rows.map(
			row => new User(row['id'], row['username'], row['display_name'], [])
		);
	};

	getUser = async (id: string): Promise<ServerUser> => {
		const { rows } = await this.pool.query({
			text:
				'SELECT id, username, display_name, password FROM users WHERE id = $1',
			values: [id],
		});

		return new ServerUser(
			rows[0]['id'],
			rows[0]['username'],
			rows[0]['display_name'],
			rows[0]['password'],
			[]
		);
	};

	getUserByUsername = async (
		username: string
	): Promise<ServerUser | undefined> => {
		const { rows } = await this.pool.query({
			text:
				'SELECT id, username, display_name, password FROM users WHERE username = $1',
			values: [username],
		});

		if (rows.length > 0) {
			return new ServerUser(
				rows[0]['id'],
				rows[0]['username'],
				rows[0]['display_name'],
				rows[0]['password'],
				[]
			);
		}

		return undefined;
	};

	insertUser = async (
		username: string,
		displayName: string,
		plainTextPassword: string
	): Promise<void> => {
		const hashedPassword: string = await hashPassword(plainTextPassword);

		await this.pool.query({
			text:
				'INSERT INTO users (id, username, display_name, password) VALUES ($1, $2, $3, $4)',
			values: [uuidv4(), username, displayName, hashedPassword],
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
