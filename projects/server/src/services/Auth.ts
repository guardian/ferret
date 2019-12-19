import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Database } from './Database';
import { User } from '@guardian/ferret-common';
import { Config } from './Config';

const SALT_ROUNDS: number = 10;

export const hashPassword = (plainTextPassword: string): Promise<string> => {
	return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
};

export const initAuth = (db: Database, config: Config) => {
	passport.use(
		new LocalStrategy(async (username, password, cb) => {
			try {
				const user = await db.userQueries.getUserByUsername(username);

				if (user === undefined) {
					console.error(`Login for '${username}' failed, not found`);
					return cb(null, false);
				}

				if (bcrypt.compare(password, user.passwordHash)) {
					console.log(`Login for '${username}' successful`);
					return cb(null, user.toUser());
				}

				return cb(null, false);
			} catch (err) {
				console.error(`Login for '${username}' failed`, err);
				return cb(err);
			}
		})
	);

	const jwtOpts = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: config.app.secret,
	};

	passport.use(
		'jwt',
		new JwtStrategy(jwtOpts, async (jwt, cb) => {
			try {
				const user = await db.userQueries.getUser(jwt.id);

				if (user !== undefined) {
					console.log(`JWT Login for '${jwt.id}' successful`);
					cb(null, user.toUser());
				} else {
					console.error(`JWT Login for '${jwt.id}' failed, not found`);
					cb(null, false);
				}
			} catch (err) {
				console.error(`JWT Login for '${jwt.id}' failed`, err);
				cb(err);
			}
		})
	);

	passport.serializeUser((user: User, cb) => {
		cb(null, user);
	});

	passport.deserializeUser(async (user: User, cb) => {
		try {
			const dbUser = await db.userQueries.getUser(user.id);
			cb(null, dbUser.toUser());
		} catch (err) {
			return cb(err);
		}
	});
};
