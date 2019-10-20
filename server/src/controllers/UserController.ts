import { Database } from '../services/Database';
import { Request, Response } from 'express';
import { handleFailure } from './helpers';
import { insertUserFormValidators } from '../model/forms/InsertUserForm';
import { validationResult } from 'express-validator';

export class UsersController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listUsers = (req: Request, res: Response) => {
		this.db.userQueries
			.listUsers()
			.then(users => {
				res.json(users);
			})
			.catch(err => handleFailure(res, err, 'Failed to list users'));
	};

	getUser = (req: Request, res: Response) => {
		this.db.userQueries
			.getUser(req.params.username)
			.then(user => res.json(user))
			.catch(err => handleFailure(res, err, 'Failed to get user'));
	};

	insertUser = [
		insertUserFormValidators,
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Invalid create user request',
					errors: errors.array(),
				});
			}

			const { username, displayName, password } = req.body;

			this.db.userQueries
				.insertUser(username, displayName, password)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert user'));
		},
	];

	updateSetting = [
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Failed to create settings',
					errors: errors.array(),
				});
			}

			const { username, displayName, password } = req.body;

			this.db.userQueries
				.insertUser(username, displayName, password)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert user'));
		},)
	]
}
