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
		database: {
			host: required(config, 'db_host'),
			port: Number(required(config, 'db_port')),
			database: required(config, 'db_database'),
			user: required(config, 'db_user'),
			password: required(config, 'db_password'),
		},
	};
};
