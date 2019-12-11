import { Database } from '../services/Database';
import { Response, Request } from 'express';
import { Config } from '../services/Config';
import { postDocumentFormValidators } from '../model/forms/PostDocumentForm';
import { checkHmacAuth, handleFailure } from './helpers';
import { validationResult } from 'express-validator';

export class DatasetController {
	db: Database;
	config: Config;

	constructor(db: Database, config: Config) {
		this.db = db;
		this.config = config;
	}

	postDocument = () => [
		checkHmacAuth(this.config.app.secret),
		postDocumentFormValidators,
		(req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Invalid insert document',
					errors: errors.array(),
				});
			}

			const { dId } = req.params;
			const { id, data } = req.body;

			this.db.datasetQueries
				.insertDocument(dId, id, data)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert document'));
		},
	];
}
