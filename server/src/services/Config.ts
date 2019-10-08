import fs from 'fs';

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

export type Config = ReturnType<typeof getConfig>;

export const getConfig = () => {
	//const config = process.env['CONFIG_PATH']!;
	//const secrets = process.env['SECRETS_PATH']!;

	return {
		database: {
			host: 'localhost', //required(config, 'DB_HOST'),
			port: 9002, // Number(required(config, 'DB_PORT')),
			database: 'osmon', //required(config, 'DB_DATABASE'),
			user: 'osmon', //required(config, 'DB_USER'),
			password: 'osmon', //required(secrets, 'postgresql-password'),
		},
	};
};
