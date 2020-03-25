import { Config } from './Config';

export type Extractor = {
	name: string;
	version: string;
	types: string[];
};

export class Extractors {
	extractors: Extractor[];

	constructor(config: Config) {
		this.extractors = config.app.extractors;
	}

	getExtractorsForMimetype = (mimeType: string) =>
		this.extractors.filter(e => e.types.includes(mimeType));
}
