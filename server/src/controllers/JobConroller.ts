import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { putFeedJobFormValidators } from '../model/forms/PutFeedJobFormValidators';
import { Config } from '../services/Config';
import { Database } from '../services/Database';
import { checkHmacAuth, handleFailure } from './helpers';

export class JobController {
	config: Config;
	db: Database;

	constructor(db: Database, config: Config) {
		this.db = db;
		this.config = config;
	}

	getReadyJobs = () => [
		checkHmacAuth(this.config.app.secret),
		async (req: Request, res: Response) => {
			this.db.feedQueries
				.getReadyJobs()
				.then(jobs => res.status(200).json(jobs))
				.catch(err => handleFailure(res, err, 'Failed to get jobs'));
		},
	];

	updateJob = () => [
		checkHmacAuth(this.config.app.secret),
		putFeedJobFormValidators,
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Invalid update feed request',
					errors: errors.array(),
				});
			}
			const { fId } = req.params;
			const { processedOn, status } = req.body;

			this.db.feedQueries
				.updateFeedJob(fId, status, processedOn)
				.then(() => res.status(200).send())
				.catch(err => handleFailure(res, err, 'Failed to insert feed'));
		},
	];

	heartbeatJob = () => [
		checkHmacAuth(this.config.app.secret),
		async (req: Request, res: Response) => {
			this.db.feedQueries
				.heartbeatJob(req.params.jId)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to heartbeat job'));
		},
	];
}
