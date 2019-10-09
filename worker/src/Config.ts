import fs from 'fs';

export type Config = ReturnType<typeof getConfig>;

const fromFsRoot = (path: string) => {
	const telepresenceRoot = process.env['TELEPRESENCE_ROOT'];
	let root = '';
	if (telepresenceRoot) {
		root = telepresenceRoot;
	}

	return `${root}/${path}`;
};

const required = (directory: string, file: string): string => {
	try {
		return fs.readFileSync(fromFsRoot(`${directory}/${file}`)).toString();
	} catch (err) {
		throw new Error(`Failed to get config at '${directory}/${file}' - ${err}`);
	}
};

export const getConfig = () => {
	const config = process.env['CONFIG_PATH']!;

	return {
		twitter: {
			consumerKey: required(config, 'osmon_twitter_consumer_key'),
			consumerSecret: required(config, 'osmon_twitter_consumer_secret'),
			accessTokenKey: required(config, 'osmon_twitter_access_token_key'),
			accessTokenSecret: required(config, 'osmon_twitter_access_token_secret'),
		},
		database: {
			host: required(config, 'osmon_db_host'),
			port: Number(required(config, 'osmon_db_port')),
			database: required(config, 'osmon_db_database'),
			user: required(config, 'osmon_db_user'),
			password: required(config, 'osmon_db_password'),
		},
	};
};
