import { Response, Request } from 'express';
import passport from 'passport';
import { Database } from '../services/Database';
import { User, Permission } from '@guardian/ferret-common';
import { ProjectAccessLevel } from '@guardian/ferret-common/dist/model/Project';
import jwt from 'jsonwebtoken';

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

export const checkLogin = passport.authenticate('jwt', { session: false });

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
		case ProjectAccessLevel.Read: {
			next();
			return;
		}
		case ProjectAccessLevel.Write: {
			if (level && level !== ProjectAccessLevel.Read) {
				next();
				return;
			}
		}
		case ProjectAccessLevel.Admin: {
			if (level && level === ProjectAccessLevel.Admin) {
				next();
				return;
			}
		}
	}

	// Forbidden
	return res.status(401).send();
};
