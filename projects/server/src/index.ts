import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import ip from 'ip';
import busboy from 'connect-busboy';
import { UsersController } from './controllers/UserController';
import { getConfig } from './services/Config';
import { Database } from './services/Database';
//import { Storage } from './services/storage';
import { JobController } from './controllers/JobConroller';
import { FeedsController } from './controllers/FeedController';
import { ProjectsController } from './controllers/ProjectController';
import { TagsController } from './controllers/TagsController';
import { initAuth } from './services/Auth';
import passport from 'passport';
import { AuthController } from './controllers/AuthController';
import { DatasetController } from './controllers/DatasetController';
import { ImagesController } from './controllers/ImagesController';

import fetch from 'node-fetch';
import { Storage } from './services/Storage';
import { Extractors } from './services/Extractors';
(global as any).fetch = fetch;

async function main() {
	// Services
	const config = getConfig();

	const storage = new Storage(config);

	const db = new Database(config);
	await db.connect();
	await db.applyMigrations();

	const extractors = new Extractors(config);

	// TODO GoogleAuth

	// Controllers
	const auth = new AuthController(db, config);
	const users = new UsersController(db);
	const jobs = new JobController(db, config);
	const feeds = new FeedsController(db);
	const projects = new ProjectsController(db);
	const tags = new TagsController(db);
	const datasets = new DatasetController(db, storage, extractors, config);
	const images = new ImagesController(config);

	// Routes
	const port = 9999;
	const app = express();
	app.use(bodyParser.json());
	app.use(passport.initialize());
	app.use(
		busboy({
			limits: {
				fileSize: config.app.maxUploadSize,
			},
		})
	);

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

	// Feeds
	app.get('/api/feeds', ...feeds.listFeeds());
	app.get('/api/feeds/:fId', ...feeds.getFeed());
	app.post('/api/feeds', ...feeds.insertFeed());

	// Jobs
	app.get('/api/jobs', ...jobs.getReadyJobs());
	app.put('/api/jobs/:jId', ...jobs.updateJob());
	app.put('/api/jobs/:jId/heartbeat', ...jobs.heartbeatJob());

	// Datasets
	app.get('/api/datasets', ...datasets.listDatasets());
	app.post('/api/datasets', ...datasets.createDataset());
	app.get('/api/datasets/:dId', ...datasets.getDataset());
	app.put('/api/datasets/:dId/type', ...datasets.changeDatasetType());
	app.post('/api/datasets/:dId/files', ...datasets.uploadFile());

	// Utils
	app.get('/api/images/search', ...images.search());

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
