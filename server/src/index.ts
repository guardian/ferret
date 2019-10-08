import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import ip from 'ip';
import { UsersController } from './controllers/UserController';
import { getConfig } from './services/Config';
import { Database } from './services/Database';
//import { Storage } from './services/storage';
import { MonitorsController } from './controllers/MonitorController';
import { ProjectsController } from './controllers/ProjectController';

async function main() {
	// Services
	const config = getConfig();

	//const storage = new Storage(config);

	const db = new Database(config);
	await db.connect();
	await db.applyMigrations();

	// Controllers
	const users = new UsersController(db);
	const monitors = new MonitorsController(db);
	const projects = new ProjectsController(db);

	// Routes
	const port = 9999;
	const app = express();
	app.use(bodyParser.json());

	app.get('/api/users', users.listUsers);
	app.get('/api/users/:username', users.getUser);
	app.post('/api/users', ...users.insertUser);

	app.get('/api/projects', projects.listProjects);
	app.post('/api/projects', ...projects.insertProject);

	app.get('/api/monitors/:id', monitors.getMonitor);
	app.post('/api/monitors', ...monitors.insertMonitor);

	app.get('/api/management/healthcheck', (req: Request, res: Response) =>
		res.send('OK')
	);

	// Launch! 🚀
	app.listen(port, () => {
		console.log(`✨ osmon listening on ${ip.address()}:${port} ✨`);
	});
}

if (require.main === module) {
	console.log('starting..');
	main();
}
