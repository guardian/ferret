import parser from 'cron-parser';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Database } from '../services/Database';
import { checkLoginAuth, getUser, handleFailure } from './helpers';

export class FeedsController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listFeeds = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			const user = getUser(req);

			this.db.feedQueries
				.listFeeds(user.id)
				.then(feeds => {
					res.json(feeds);
				})
				.catch(err => handleFailure(res, err, 'Failed to list feeds'));
		},
	];

	getFeed = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			const user = getUser(req);

			this.db.feedQueries
				.getFeed(req.params.fId, user.id)
				.then(feed => res.json(feed))
				.catch(err => handleFailure(res, err, 'Failed to get feed'));
		},
	];

	insertFeed = () => [
		checkLoginAuth,
		//postFeedFormValidators,
		async (req: Request, res: Response) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json({
					message: 'Invalid create feed request',
					errors: errors.array(),
				});
			}

			const user = getUser(req);

			const { title, frequency, type, parameters } = req.body;

			try {
				parser.parseExpression(frequency);
			} catch (err) {
				return handleFailure(res, err, 'Failed to insert feed');
			}

			this.db.feedQueries
				.insertFeed(user.id, title, type, frequency, parameters)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert feed'));
		},
	];
}
