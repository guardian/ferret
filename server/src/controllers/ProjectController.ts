import { Database } from '../services/Database';
import { handleFailure } from './helpers';
import { Request, Response } from 'express';
import { insertProjectFormValidators } from '../model/forms/InsertProjectForm';
import { validationResult } from 'express-validator';

export class ProjectsController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listProjects = (req: Request, res: Response) => {
		this.db.projectQueries
			.listProjects()
			.then(monitors => {
				res.json(monitors);
			})
			.catch(err => handleFailure(res, err, 'Failed to list projects'));
	};

	insertProject = [
		insertProjectFormValidators,
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Invalid create project request',
					errors: errors.array(),
				});
			}

			const { name, image } = req.body;

			this.db.projectQueries
				.insertProject(name, image, 'default')
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert project'));
		},
	];
}
