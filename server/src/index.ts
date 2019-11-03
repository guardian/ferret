import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import ip from 'ip';
import { UsersController } from './controllers/UserController';
import { getConfig } from './services/Config';
import { Database } from './services/Database';
//import { Storage } from './services/storage';
import { MonitorsController } from './controllers/MonitorController';
import { ProjectsController } from './controllers/ProjectController';
import { TagsController } from './controllers/TagsController';
import { JobsController } from './controllers/JobsController';
import { initAuth } from './services/Auth';
import passport from 'passport';
import { AuthController } from './controllers/AuthController';

async function main() {
	// Services
	const config = getConfig();

	//const storage = new Storage(config);

	const db = new Database(config);
	await db.connect();
	//await db.applyMigrations();

	// TODO GoogleAuth

	// Controllers
	const auth = new AuthController(db, config);
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

	initAuth(db, config);

	// Auth
	app.post('/api/login', ...auth.login());

	// Users
	app.get('/api/users', ...users.listUsers());
	app.get('/api/users/:uId', ...users.getUser());
	app.post('/api/users', ...users.insertUser());
	app.patch('/api/users/:uId/settings', ...users.patchSetting());

	// Tags
	app.get('/api/tags', ...tags.listTags());
	app.post('/api/tags', ...tags.insertTag());

	// Projects
	app.get('/api/projects', ...projects.listProjects());
	app.post('/api/projects', ...projects.insertProject());
	app.get('/api/projects/:pId/timelines', ...projects.listTimelines());
	app.post('/api/projects/:pId/timelines', ...projects.insertTimeline());
	app.get(
		'/api/projects/:pId/timelines/:tId/entries/',
		...projects.getTimelineEntries()
	);
	app.post(
		'/api/projects/:pId/timelines/:tId/entries/',
		...projects.postTimelineEntry()
	);
	app.put(
		'/api/projects/:pId/timelines/:tId/entries/reorder',
		...projects.reorderTimelineEntries()
	);
	app.put(
		'/api/projects/:pId/timelines/:tId/entries/:eId',
		...projects.putTimelineEntry()
	);
	app.delete(
		'/api/projects/:pId/timelines/:tId/entries/:eId',
		...projects.deleteTimelineEntry()
	);
	//app.get(
	//	'/api/projects/:pId/timelines/:tId/evidence',
	//	...projects.getTimelineEvidence
	//);

	// Monitors
	app.get('/api/monitors', ...monitors.listMonitors());
	app.get('/api/monitors/:mId', ...monitors.getMonitor());
	app.post('/api/monitors', ...monitors.insertMonitor());
	app.put('/api/monitors/:mId', ...monitors.updateMonitor());
	app.get('/api/monitors/:mId/tweets', monitors.getMonitorTweets());
	app.post('/api//monitors/:mId/tweets', ...monitors.insertTweetForMonitor());

	// Jobs
	app.get('/api/jobs', ...jobs.listJobs());

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
