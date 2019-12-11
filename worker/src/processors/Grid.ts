import fetch from 'node-fetch';
import { Config } from '../services/Config';

export class GridProcessor {
	apiHost: string;
	apiKey: string;

	constructor(config: Config) {
		this.apiHost = config.grid.apiHost;
		this.apiKey = config.grid.apiKey;
	}

	getImages = async (
		since: string,
		until: string,
		q: string
	): Promise<any[]> => {
		const defaultArgs = '&offset=0&length=100&orderBy=uploadTime';

		const url =
			this.apiHost +
			`/images` +
			`?q=${q}` +
			`&since=${since}&until=${until}` +
			`&apiKey=${this.apiKey}` +
			defaultArgs;

		const res = await fetch(url);

		if (res.status === 200) {
			const result = await res.json();
			const images = result.data;
			return images.map((image: any) => {
				image.data;
			});
		}
	};
}
