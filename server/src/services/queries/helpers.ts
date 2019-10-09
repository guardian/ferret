import { Pool, PoolClient } from 'pg';

export async function transactionally<T>(
	pool: Pool,
	func: (client: PoolClient) => Promise<T>
): Promise<T> {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const value = await func(client);
		await client.query('COMMIT');
		return value;
	} catch (e) {
		await pool.query('ROLLBACK');
		return Promise.reject(e);
	} finally {
		client.release();
	}
}
