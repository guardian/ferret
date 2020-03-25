import { Request, Response } from 'express';
import _ from 'lodash';
import Unsplash, { toJson } from 'unsplash-js';
import { Config } from '../services/Config';
import { checkLoginAuth } from './helpers';

export class ImagesController {
	config: Config;
	unsplash: Unsplash;

	constructor(config: Config) {
		this.config = config;
		this.unsplash = new Unsplash({
			accessKey: config.unsplash.accessKey,
			secret: config.unsplash.secretKey,
			callbackUrl: config.unsplash.callbackUrl,
		});
	}

	search = () => [
		checkLoginAuth,
		async (req: Request, res: Response) => {
			let { q, page } = req.query;

			if (!q) {
				q = _.sample([
					'forest',
					'tower',
					'garden',
					'city',
					'office',
					'building',
				]);
			}
			const photos = await this.unsplash.search.photos(q, page).then(toJson);

			return res.json(photos);
		},
	];
}
