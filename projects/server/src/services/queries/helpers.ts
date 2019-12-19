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

// Use a pool client ratehr than raw pool to force the audit to be done within the same transaction
export const generateAuditQuery = async (client: PoolClient) => {
	/**
	 * CREATE TABLE events (
    user_id     TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    action      EVENT_ACTION NOT NULL,
    resource    TEXT NOT NULL,
    description TEXT NOT NULL
);

	 */
	client.query({
		text: `INSERT INTO project_audits (user_id, action, )`,
		values: [],
	});
};
