import { Database } from '../services/Database';
import { Request, Response } from 'express';
import { handleFailure, checkLoginAuth } from './helpers';
import { postTagFormValidators } from '../model/forms/PostTagForm';
import { validationResult } from 'express-validator';

export class TagsController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listTags = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			this.db.tagQueries
				.listTags()
				.then(users => {
					res.json(users);
				})
				.catch(err => handleFailure(res, err, 'Failed to list tags'));
		},
	];

	insertTag = () => [
		checkLoginAuth,
		postTagFormValidators,
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Invalid create tag request',
					errors: errors.array(),
				});
			}

			const { label, color } = req.body;

			this.db.tagQueries
				.insertTag(label, color)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert tag'));
		},
	];
}
