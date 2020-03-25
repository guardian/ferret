import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { postProjectFormValidators } from '../model/forms/PostProjectForm';
import { Database } from '../services/Database';
import {
	checkLoginAuth,
	checkUserPermissions,
	getUser,
	handleFailure,
} from './helpers';

export class ProjectsController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listProjects = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			const user = getUser(req);
			this.db.projectQueries
				.listProjects(user.id)
				.then(projects => {
					res.json(projects);
				})
				.catch(err => handleFailure(res, err, 'Failed to list projects'));
		},
	];

	insertProject = () => {
		return [
			checkLoginAuth,
			checkUserPermissions('manage_projects'),
			postProjectFormValidators,
			async (req: Request, res: Response) => {
				const errors = validationResult(req);

				if (!errors.isEmpty()) {
					return res.status(422).json({
						message: 'Invalid create project request',
						errors: errors.array(),
					});
				}

				const { title, image } = req.body;

				const user = getUser(req);
				this.db.projectQueries
					.insertProject(title, image, user.id)
					.then(() => res.status(201).send())
					.catch(err => handleFailure(res, err, 'Failed to insert project'));
			},
		];
	};
}
