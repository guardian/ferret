import { Request, Response } from 'express';
import { postDatasetFormValidators } from '../model/forms/PostDatasetForm';
import { Config } from '../services/Config';
import { Database } from '../services/Database';
import { Storage } from '../services/Storage';
import { Extractors } from '../services/Extractors';
import { checkLoginAuth, getUser, handleFailure } from './helpers';

export class DatasetController {
	db: Database;
	storage: Storage;
	config: Config;
	extractors: Extractors;

	constructor(
		db: Database,
		storage: Storage,
		extractors: Extractors,
		config: Config
	) {
		this.db = db;
		this.storage = storage;
		this.config = config;
		this.extractors = extractors;
	}

	listDatasets = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			const user = getUser(req);

			this.db.datasetQueries
				.listDatasets(user.id)
				.then(datasets => res.json(datasets))
				.catch(err => handleFailure(res, err, 'Failed to get datasets'));
		},
	];

	createDataset = () => [
		checkLoginAuth,
		//checkHmacAuth(this.config.app.secret),
		postDatasetFormValidators,
		(req: Request, res: Response) => {
			const user = getUser(req);

			this.db.datasetQueries
				.createDataset(user.id, req.body.title, req.body.image)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to create dataset'));
		},
	];

	getDataset = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			const user = getUser(req);

			this.db.datasetQueries
				.getDataset(user.id, req.params.dId)
				.then(dataset => res.json(dataset))
				.catch(err => handleFailure(res, err, 'Failed to create dataset'));
		},
	];

	changeDatasetType = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			const user = getUser(req);

			this.db.datasetQueries
				.updateDatasetType(user.id, req.params.dId, req.body.type)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to update dataset type'));
		},
	];

	uploadFile = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			const datasetId = req.params.dId;

			req.pipe(req.busboy);

			req.busboy.on('file', (_field, inputStream, filename) => {
				this.storage
					.uploadFile(inputStream)
					.then(fsr => {
						const extractors = this.extractors.getExtractorsForMimetype(
							fsr.mimeType
						);

						this.db.datasetQueries
							.insertBlobFile(fsr, datasetId, filename, extractors)
							.then(() => res.status(201).send())
							.catch(err => handleFailure(res, err, 'Failed to upload file'));

						res.status(201).send();
					})
					.catch(err => handleFailure(res, err, 'Failed to upload file'));
			});
		},
	];

	getFiles = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			// permissoins check.
			// if failed -> 404
			// data set ID + base path + recurse depth?
		},
	];
}
