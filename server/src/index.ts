import bodyParser from 'body-parser';
import express, { Request, Response, RequestHandler } from 'express';
import ip from 'ip';
import { UsersController } from './controllers/UserController';
import { getConfig } from './services/Config';
import { Database } from './services/Database';
//import { Storage } from './services/storage';
import { MonitorsController } from './controllers/MonitorController';
import { ProjectsController } from './controllers/ProjectController';
import { TagsController } from './controllers/TagsController';
import { JobsController } from './controllers/JobsController';
import { initLocalAuth } from './services/LocalAuth';
import { ensureLoggedIn } from 'connect-ensure-login';
import passport from 'passport';
import jwt from 'jsonwebtoken';

async function main() {
	// Services
	const config = getConfig();

	//const storage = new Storage(config);

	const db = new Database(config);
	await db.connect();
	await db.applyMigrations();

	// TODO GoogleAuth

	// Controllers
	const users = new UsersController(db);
	const monitors = new MonitorsController(db);
	const projects = new ProjectsController(db);
	const tags = new TagsController(db);
	const jobs = new JobsController(db);

	// Routes
	const port = 9999;
	const app = express();
	app.use(bodyParser.json());
	app.use(passport.initialize());

	// Auth
	initLocalAuth(db, config);

	const requireAuth = passport.authenticate('jwt', { session: false });
	const projectPermissionsCheck = (
		req: Request,
		res: Response,
		next: Function
	) => {
		next();
	};

	app.post(
		'/api/login',
		passport.authenticate('local', { failureRedirect: '/login' }),
		(req, res) => {
			const user = { ...req.session!.passport.user };
			console.log(user);
			const token = jwt.sign(user, config.app.secret, {
				expiresIn: 60 * 60,
			});

			res.status(200).send({
				token,
			});
		}
	);

	// Users
	app.get('/api/users', requireAuth, users.listUsers);
	app.get('/api/users/:uId', requireAuth, users.getUser);
	app.post('/api/users', requireAuth, ...users.insertUser);
	app.patch('/api/users/:uId/settings', requireAuth, ...users.patchSetting);

	// Tags
	app.get('/api/tags', requireAuth, tags.listTags);
	app.post('/api/tags', requireAuth, ...tags.insertTag);

	// Projects
	app.get('/api/projects', requireAuth, projects.listProjects);
	app.post('/api/projects', requireAuth, ...projects.insertProject);
	app.get(
		'/api/projects/:pId/timelines',
		requireAuth,
		projectPermissionsCheck,
		projects.getTimelines
	);
	app.post(
		'/api/projects/:pId/timelines',
		requireAuth,
		projectPermissionsCheck,
		...projects.insertTimelines
	);
	app.get(
		'/api/projects/:pId/timelines/:tId/evidence',
		requireAuth,
		projectPermissionsCheck,
		projects.getTimelineEvidence
	);

	// Monitors
	app.get('/api/monitors', requireAuth, monitors.listMonitors);
	app.get('/api/monitors/:mId', requireAuth, monitors.getMonitor);
	app.post('/api/monitors', requireAuth, ...monitors.insertMonitor);
	app.put('/api/monitors/:mId', requireAuth, ...monitors.updateMonitor);
	app.get('/api/monitors/:mId/tweets', requireAuth, monitors.getMonitorTweets);
	app.post(
		'/api//monitors/:mId/tweets',
		requireAuth,
		monitors.insertTweetForMonitor
	);

	// Jobs
	app.get('/api/jobs', requireAuth, jobs.listJobs);

	app.get('/api/management/healthcheck', (req: Request, res: Response) =>
		res.send('OK')
	);

	// Launch! 🚀
	app.listen(port, () => {
		console.log(`✨ ferret listening on ${ip.address()}:${port} ✨`);
	});
}

if (require.main === module) {
	main();
}
