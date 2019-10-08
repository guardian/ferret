import { Pool } from 'pg';
import { Config } from './Config';

export class Database {
	private host: string;
	private port: number;

	private database: string;
	private user: string;
	private password: string;

	private pool: Pool;

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
	}

	connect = () => this.pool.connect();

	getWork = () => {};

	updateMonitor = (id: string, lastUpdated: Date) => {};
}
