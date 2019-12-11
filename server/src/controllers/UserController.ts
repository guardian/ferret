import { Database } from '../services/Database';
import { Request, Response } from 'express';
import {
	handleFailure,
	checkLoginAuth,
	getUser,
	checkUserPermissions,
} from './helpers';
import { postUserFormValidators } from '../model/forms/PostUserForm';
import { validationResult } from 'express-validator';
import { User, Permission } from '@guardian/ferret-common';

export class UsersController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listUsers = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			this.db.userQueries
				.listUsers()
				.then(users => {
					res.json(users);
				})
				.catch(err => handleFailure(res, err, 'Failed to list users'));
		},
	];

	getUser = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			this.db.userQueries
				.getUser(req.params.uId)
				.then(user => res.json(user))
				.catch(err => handleFailure(res, err, 'Failed to get user'));
		},
	];

	insertUser = () => [
		checkLoginAuth,
		checkUserPermissions('manage_users'),
		postUserFormValidators,
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
				.insertUser(username, displayName, password, [])
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert user'));
		},
	];

	patchSetting = () => [
		checkLoginAuth,
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Failed to create settings',
					errors: errors.array(),
				});
			}

			const { settings } = req.body;

			const user = getUser(req);

			// TODO confirm this actually uses the encrypted part of the JWT
			if (user.id === req.params.uId) {
				this.db.userQueries
					.updateSetting(req.params.uId, settings)
					.then(() => res.status(201).send())
					.catch(err => handleFailure(res, err, 'Failed to insert user'));
			} else {
				return res.status(403);
			}
		},
	];
}
