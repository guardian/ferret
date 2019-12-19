import { Pool } from 'pg';

export class DatasetQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	insertDocument = async (
		datasetId: string,
		documentId: string,
		documentBody: Object
	) => {
		await this.pool.query({
			text: `INSERT INTO documents (dataset_id, id, added_on, document) 
            VALUES ($1, $2, NOW(), $3)`,
			values: [datasetId, documentId, documentBody],
		});

		return;
	};
}
