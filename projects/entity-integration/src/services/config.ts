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
	const config = process.env['CONFIG_PATH']!;

	return {
		ukCompaniesHouse: {
			apiUrl: 'https://api.companieshouse.gov.uk/', //required(config, 'uk-companies-house-api-key'),,
			apiKey: '2oex09-dr4LHW3giTTxAB1ja7s4rmpM8N2RZdQXQ',
		},
		openCorporates: {
			apiUrl: '',
			apiKey: 'test', //required(config, 'open-corporates-api-key'),
		},
	};
};
