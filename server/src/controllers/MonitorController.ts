import { Database } from '../services/Database';
import { handleFailure } from './helpers';
import { Request, Response } from 'express';
import { insertMonitorFormValidators } from '../model/forms/InsertMonitorForm';
import { validationResult } from 'express-validator';

export class MonitorsController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listMonitors = (req: Request, res: Response) => {
		this.db.monitorQueries
			.listMonitors()
			.then(monitors => {
				res.json(monitors);
			})
			.catch(err => handleFailure(res, err, 'Failed to list monitors'));
	};

	getMonitor = (req: Request, res: Response) => {
		this.db.monitorQueries
			.getMonitor(req.params.id)
			.then(monitor => res.json(monitor))
			.catch(err => handleFailure(res, err, 'Failed to get monitor'));
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
				.insertMonitor(name, query)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert monitor'));
		},
	];
}
