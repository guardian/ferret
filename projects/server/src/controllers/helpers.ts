import { Response, Request } from 'express';
import passport from 'passport';
import { Database } from '../services/Database';
import { User, Permission } from '@guardian/ferret-common';
import { ProjectAccessLevel } from '@guardian/ferret-common/dist/model/Project';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Can probably do this more cleanly with middleware
export const handleFailure = (res: Response, err: any, message: string) => {
	console.error(err);
	res.status(500).send(errorResponse(message));
};

export const errorResponse = (message: string) => {
	return {
		message,
	};
};

export const checkHmacAuth = (secret: string) => (
	req: Request,
	res: Response,
	next: Function
) => {
	const hash = req.header('Authorization');
	const date = req.header('X-Authorization-Timestamp');

	if (date && Date.now() - Date.parse(date) < 500) {
		const hmac = crypto.createHmac('sha256', secret);
		const verb = req.method;
		const url = req.url;

		const content = date + '\n' + verb + '\n' + url;
		console.log(secret, date, verb, url);

		hmac.update(content, 'utf8');

		const serverHash = 'HMAC ' + hmac.digest('base64');

		console.log(`Send - ${hash}`);
		console.log(`Gen  - ${serverHash}`);
		if (hash === serverHash) {
			return next();
		} else {
			return res.status(401).send();
		}
	} else {
		console.error('HMAC timestamp undefined or too old!');
		return res.status(401).send();
	}
};

export const checkLoginAuth = passport.authenticate('jwt', { session: false });

export const getUser = (req: Request): User => {
	const auth = req.headers.authorization;
	if (auth) {
		const token = auth.replace('Bearer ', '');
		const decoded = jwt.decode(token);
		return decoded as User;
	}
	throw Error('No authorisation token!');
};

export const checkUserPermissions = (permission: Permission) => async (
	req: Request,
	res: Response,
	next: Function
) => {
	const user = getUser(req);

	if (user.permissions.includes(permission)) {
		return next();
	} else {
		return res.status(403).send();
	}
};

export const checkProjectPermissions = (
	db: Database,
	requiredLevel: ProjectAccessLevel
) => async (req: Request, res: Response, next: Function) => {
	const user = getUser(req);

	const level = await db.projectQueries.getUserPermissionForProject(
		user.id,
		req.params.pId
	);

	if (!level) {
		// Not found!
		return res.status(404).send();
	}

	switch (requiredLevel) {
		case 'read': {
			next();
			return;
		}
		case 'write': {
			if (level && level !== 'read') {
				next();
				return;
			}
		}
		case 'admin': {
			if (level && level === 'admin') {
				next();
				return;
			}
		}
	}

	// Forbidden
	return res.status(401).send();
};
