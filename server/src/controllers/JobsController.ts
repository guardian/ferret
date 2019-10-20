import { Database } from '../services/Database';
import { Request, Response } from 'express';
import { handleFailure } from './helpers';

export class JobsController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listJobs = (req: Request, res: Response) => {
		//this.db.jobQueries
		//	.listJobs()
		//	.then(jobs => {
		//		res.json(users);
		//	})
		//	.catch(err => handleFailure(res, err, 'Failed to list jobs'));
	};
}
