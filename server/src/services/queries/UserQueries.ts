import { hashPassword } from '../passwords';
import { User } from '../../model/User';
import { Pool } from 'pg';
import uuidv4 from 'uuid';

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
			row => new User(row['id'], row['username'], row['display_name'])
		);
	};

	getUser = async (username: string): Promise<User> => {
		const { rows } = await this.pool.query({
			text: 'SELECT id, username, display_name FROM users WHERE username = $1',
			values: [username],
		});

		return new User(
			rows[0]['id'],
			rows[0]['username'],
			rows[0]['display_name']
		);
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
}
