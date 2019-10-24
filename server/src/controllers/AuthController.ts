import { Database } from '../services/Database';
import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Config } from '../services/Config';
import { getUser } from './helpers';

export class AuthController {
	db: Database;
	config: Config;

	constructor(db: Database, config: Config) {
		this.db = db;
		this.config = config;
	}

	login = () => [
		passport.authenticate('local', { failureRedirect: '/login' }),
		(req: Request, res: Response) => {
			const user = (req as any).session.passport.user;

			const token = jwt.sign(user, this.config.app.secret, {
				expiresIn: 60 * 60,
			});

			res.status(200).send({
				token,
			});
		},
	];
}
