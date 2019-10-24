import { Database } from '../services/Database';
import { handleFailure, checkLogin } from './helpers';
import { Request, Response } from 'express';
import { postMonitorFormValidators } from '../model/forms/PostMonitorForm';
import { validationResult } from 'express-validator';
import { putMonitorFormValidators } from '../model/forms/PutMonitorForm';

export class MonitorsController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listMonitors = () => [
		checkLogin,
		(req: Request, res: Response) => {
			this.db.monitorQueries
				.listMonitors(req.params.pId)
				.then(monitors => {
					res.json(monitors);
				})
				.catch(err => handleFailure(res, err, 'Failed to list monitors'));
		},
	];

	getMonitor = () => [
		checkLogin,
		(req: Request, res: Response) => {
			this.db.monitorQueries
				.getMonitor(req.params.mId)
				.then(monitor => res.json(monitor))
				.catch(err => handleFailure(res, err, 'Failed to get monitor'));
		},
	];

	getMonitorTweets = () => [
		checkLogin,
		(req: Request, res: Response) => {
			this.db.monitorQueries
				.getMonitorTweets(req.params.mId)
				.then(tweets => res.json(tweets))
				.catch(err => handleFailure(res, err, 'Failed to get monitor tweets'));
		},
	];

	insertTweetForMonitor = () => [
		checkLogin,
		async (req: Request, res: Response) => {
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
				.catch(err =>
					handleFailure(res, err, 'Failed to add tweet to monitor')
				);
		},
	];

	insertMonitor = () => [
		checkLogin,
		postMonitorFormValidators,
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Invalid create monitor request',
					errors: errors.array(),
				});
			}

			const { title, query } = req.body;

			this.db.monitorQueries
				.insertMonitor(req.params.pId, title, query)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert monitor'));
		},
	];

	updateMonitor = () => [
		checkLogin,
		putMonitorFormValidators,
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
