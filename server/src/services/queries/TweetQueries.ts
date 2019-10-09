import { Pool } from 'pg';

export class TweetQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	insertTweet = (id: string, status: any): Promise<any> => {
		return this.pool.query({
			text: 'INSERT INTO tweets (id, status) VALUES ($1, $2::JSONB)',
			values: [id, JSON.stringify(status)],
		});
	};
}
