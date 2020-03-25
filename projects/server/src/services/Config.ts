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
		return fs
			.readFileSync(fromFsRoot(`${directory}/${file}`))
			.toString()
			.trim();
	} catch (err) {
		throw new Error(`Failed to get config at '${directory}/${file}' - ${err}`);
	}
};

export const getConfig = () => {
	const configPath = process.env['CONFIG_PATH']!;

	return {
		app: {
			secret: required(configPath, 'app_secret'),
			maxUploadSize: Number(required(configPath, 'app_max_upload_size')),
			extractors: JSON.parse(required(configPath, 'app_extractors')),
		},
		database: {
			host: required(configPath, 'db_host'),
			port: Number(required(configPath, 'db_port')),
			database: required(configPath, 'db_database'),
			user: required(configPath, 'db_user'),
			password: required(configPath, 'db_password'),
		},
		storage: {
			root: required(configPath, 'storage_root'),
		},
		unsplash: {
			accessKey: required(configPath, 'unsplash_access_key'),
			secretKey: required(configPath, 'unsplash_secret_key'),
			callbackUrl: required(configPath, 'unsplash_callback_url'),
		},
	};
};
