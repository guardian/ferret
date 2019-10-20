import Postgrator from 'postgrator';
import { Pool } from 'pg';
import { UserQueries } from './queries/UserQueries';
import { MonitorQueries } from './queries/MonitorQueries';
import { Config } from './Config';
import { ProjectQueries } from './queries/projectQueries';
import { TagQueries } from './queries/TagQueries';
//import { JobQueries } from './queries/JobQueries';

export class Database {
	private host: string;
	private port: number;

	private database: string;
	private user: string;
	private password: string;

	private pool: Pool;

	public userQueries: UserQueries;
	public monitorQueries: MonitorQueries;
	public projectQueries: ProjectQueries;
	public tagQueries: TagQueries;
	//public jobQueries: JobQueries;

	constructor(config: Config) {
		const { host, port, database, user, password } = config.database;

		this.host = host;
		this.port = port;
		this.database = database;
		this.user = user;
		this.password = password;
		this.pool = new Pool({
			host,
			port,
			database,
			user,
			password,
		});

		this.userQueries = new UserQueries(this.pool);
		this.monitorQueries = new MonitorQueries(this.pool);
		this.projectQueries = new ProjectQueries(this.pool);
		this.tagQueries = new TagQueries(this.pool);
		//		this.jobQueries = new JobQueries(this.pool);
	}

	connect = () => this.pool.connect();

	applyMigrations = async (): Promise<void> => {
		const options: Postgrator.PostgreSQLOptions = {
			migrationDirectory: __dirname + '/migrations',
			driver: 'pg',
			host: this.host,
			port: this.port,
			database: this.database,
			username: this.user,
			password: this.password,
		};

		const postgrator = new Postgrator(options);

		return postgrator
			.migrate()
			.then(migrations => {
				if (migrations.length > 0) {
					console.log('Successfully applied migrations!');
					console.log(migrations);
				}
			})
			.catch(error => {
				console.error('Failed to apply migrations');
				console.log(error);
				throw error;
			});
	};
}
