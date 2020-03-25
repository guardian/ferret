import { Pool, Client } from 'pg';
import uuidv4 from 'uuid';
import { transactionally } from './helpers';
import { FileStorageResult } from '../../model/FileStorageResult';
import { Dataset, DatasetType, DatasetFile } from '@guardian/ferret-common';
import { Extractor } from '../Extractors';

export class DatasetQueries {
	pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	listDatasets = async (userId: string): Promise<Dataset[]> => {
		const { rows } = await this.pool.query({
			text: `SELECT id, title, type, image
			FROM datasets
			INNER JOIN user_datasets ON dataset_id = datasets.id
			WHERE user_id = $1`,
			values: [userId],
		});

		return rows.map(row => ({
			id: row['id'],
			title: row['title'],
			type: row['type'],
			image: row['image'],
		}));
	};

	getDataset = async (userId: string, dId: string): Promise<Dataset> => {
		const { rows } = await this.pool.query({
			text: `SELECT id, title, type, image
			FROM datasets
			INNER JOIN user_datasets ON dataset_id = datasets.id
			WHERE user_id = $1 AND id = $2`,
			values: [userId, dId],
		});

		const row = rows[0];

		return {
			id: row['id'],
			title: row['title'],
			type: row['type'],
			image: row['image'],
		};
	};

	createDataset = async (userId: string, title: string, image: string) => {
		transactionally(this.pool, async client => {
			const datasetId = uuidv4();
			await client.query({
				text: `INSERT INTO datasets (id, type, title, image) VALUES ($1, $2, $3, $4)`,
				values: [datasetId, 'empty', title, image],
			});

			await client.query({
				text: `INSERT INTO user_datasets (user_id, dataset_id, access_level) VALUES ($1, $2, 'admin')`,
				values: [userId, datasetId],
			});
		});
	};

	updateDatasetType = async (
		userId: string,
		dId: string,
		type: DatasetType
	) => {
		await this.pool.query({
			text: `UPDATE datasets 
			SET type = $1
			FROM user_datasets 
			WHERE datasets.id = $2
				AND user_datasets.dataset_id = datasets.id
				AND user_datasets.user_id = $3
				AND datasets.type = 'empty'`,
			values: [type, dId, userId],
		});

		return;
	};

	insertDirectoryFile = async (datasetId: string, path: string) => {
		await this.pool.query({
			text: `INSERT INTO files (dataset_id, path, type) VALUES ($1, $2, 'directory')`,
			values: [datasetId, path],
		});
		return;
	};

	insertBlobFile = async (
		fsr: FileStorageResult,
		datasetId: string,
		path: string,
		extractors: Extractor[]
	): Promise<void> => {
		transactionally(this.pool, async client => {
			await client.query({
				text: `INSERT INTO blobs (id, mime, object_location, blob_data) VALUES ($1, $2, $3, '{}'::JSONB) ON CONFLICT DO NOTHING`,
				values: [fsr.hash, fsr.mimeType, fsr.location],
			});

			for (let extractor of extractors) {
				await client.query({
					text: `INSERT INTO extractor_jobs (id, job_name) VALUES ($1, $2)`,
					values: [uuidv4(), extractor.name],
				});
			}

			await client.query({
				text: `INSERT INTO files (dataset_id, path, type, blob_id) VALUES ($1, $2, 'blob', $3)`,
				values: [datasetId, path, fsr.hash],
			});
		});
	};

	insertLinkFile = async (datasetId: string, path: string, fileId: string) => {
		throw new Error('unimplemented');
	};

	getFilesFromPath = async (
		datasetId: string,
		parentPath: string
	): Promise<DatasetFile[]> => {
		const { rows } = await this.pool.query({
			text: `SELECT *
			FROM files
			INNER JOIN datasets ON id = files.dataset_id
			INNER JOIN user_datasets ON files.dataset_id = datasets.id
			WHERE files.dataset_id = $1 AND files.parent_path = $2`,
			values: [datasetId, parentPath],
		});

		return rows.map(row => {
			const linkPath = row['linked_file_path'];
			const linkDataset = row['linked_file_dataset_id'];

			return {
				path: row['path'],
				addedOn: row['added_on'],
				type: row['type'],

				blobId: row['blob_id'],
				timelineId: row['timeline_id'],
				linkPath:
					linkPath && linkDataset
						? { path: linkPath, datasetId: linkDataset }
						: undefined,
			};
		});
	};
}
