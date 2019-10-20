import { Database } from '../services/Database';
import { handleFailure } from './helpers';
import { Request, Response } from 'express';
import { insertProjectFormValidators } from '../model/forms/InsertProjectForm';
import { validationResult } from 'express-validator';
import { User } from '@guardian/ferret-common';

export class ProjectsController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listProjects = (req: Request, res: Response) => {
		this.db.projectQueries
			.listProjects()
			.then(projects => {
				res.json(projects);
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

			const user = req.user as User;
			this.db.projectQueries
				.insertProject(name, image, user.id)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert project'));
		},
	];

	listTimelines = (req: Request, res: Response) => {
		this.db.projectQueries
			.listTimelines()
			.then(timelines => {
				res.json(timelines);
			})
			.catch(err => handleFailure(res, err, 'Failed to list timelines'));
	};
}
