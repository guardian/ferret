import { Database } from '../services/Database';
import { handleFailure } from './helpers';
import { Request, Response } from 'express';
import { insertMonitorFormValidators } from '../model/forms/InsertMonitorForm';
import { validationResult } from 'express-validator';
import { updateMonitorFormValidators } from '../model/forms/UpdateMonitorForm';

export class MonitorsController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listMonitors = (req: Request, res: Response) => {
		this.db.monitorQueries
			.listMonitors(req.params.pId)
			.then(monitors => {
				res.json(monitors);
			})
			.catch(err => handleFailure(res, err, 'Failed to list monitors'));
	};

	getMonitor = (req: Request, res: Response) => {
		console.log(req.params);
		this.db.monitorQueries
			.getMonitor(req.params.mId)
			.then(monitor => res.json(monitor))
			.catch(err => handleFailure(res, err, 'Failed to get monitor'));
	};

	getMonitorTweets = (req: Request, res: Response) => {
		this.db.monitorQueries
			.getMonitorTweets(req.params.mId)
			.then(tweets => res.json(tweets))
			.catch(err => handleFailure(res, err, 'Failed to get monitor tweets'));
	};

	insertTweetForMonitor = async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({
				message: 'Invalid add tweet to monitor request',
				errors: errors.array(),
			});
		}

		this.db.monitorQueries
			.insertTweetForMonitor(req.params.mId, req.body)
			.then(() => res.status(201).send())
			.catch(err => handleFailure(res, err, 'Failed to add tweet to monitor'));
	};

	insertMonitor = [
		insertMonitorFormValidators,
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Invalid create monitor request',
					errors: errors.array(),
				});
			}

			const { name, query } = req.body;

			this.db.monitorQueries
				.insertMonitor(req.params.pId, name, query)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert monitor'));
		},
	];

	updateMonitor = [
		updateMonitorFormValidators,
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Invalid update monitor request',
					errors: errors.array(),
				});
			}

			const { sinceId, updatedAt, count } = req.body;
			this.db.monitorQueries.updateMonitorProgress(
				req.params.mId,
				sinceId,
				updatedAt,
				count
			);
		},
	];
}
