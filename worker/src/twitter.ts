import Twitter from 'twitter';
import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';
import { uploadObject, uploadFile } from './S3';
import { extractMedia } from './extractMedia';
import { download } from './download';
import { Ferret } from './FerretApi';

const search = (
	client: Twitter,
	query: string,
	sinceId?: string,
	maxId?: string
): Promise<any> => {
	return new Promise((resolve, reject) => {
		client.get(
			'search/tweets',
			{
				q: query,
				count: 100,
				include_entities: true,
				max_id: maxId,
				since_id: sinceId,
			},
			(err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			}
		);
	});
};
const saveStatuses = async (
	statuses: any[],
	ferret: Ferret,
	pId: string,
	mId: string
) => {
	const toCleanUp = [];
	for (let i = 0; i < statuses.length; i++) {
		const status = statuses[i];

		const { id_str, extended_entities } = status;

		const tweetPath = `${mId}/${id_str}/`;
		const statusPath = tweetPath + 'status.json';
		//await ferret.insertTweet(pId, mId, status);

		try {
			await uploadObject(status, 'ferret-temp', statusPath);
		} catch (err) {
			console.error('Failed to upload status to s3', err);
		}

		if (extended_entities && extended_entities.media) {
			const mediaObjects = extractMedia(extended_entities.media);

			for (let i = 0; i < mediaObjects.length; i++) {
				const fileName = mediaObjects[i].title;
				const filePath = path.resolve(os.tmpdir(), fileName);

				await download(mediaObjects[i].url, filePath);
				toCleanUp.push(filePath);

				try {
					await uploadFile(
						filePath,
						mediaObjects[i].contentType,
						'ferret-temp',
						tweetPath + mediaObjects[i].title
					);
				} catch (err) {
					console.error('failed to upload file to s3', err);
				}
			}
		}
	}
	// cleanup
};
export const processTweets = async (
	ferret: Ferret,
	client: Twitter,
	pId: string,
	mId: string,
	query: string,
	sinceId?: string
) => {
	const updatedAt = new Date();

	let i = 0;
	console.log(`getting page ${++i}`);
	let tweets = await search(client, query, sinceId);

	// On the first request we store the max_id so we can use that as the since ID next time
	const nextSinceId = tweets.search_metadata.max_id_str;
	saveStatuses(tweets.statuses, ferret, pId, mId);

	return;
	// while (tweets.search_metadata.next_results) {
	// 	// extract new maxId from next_results
	// 	const maxIdMatch = /max_id=(\d.*)/.exec(
	// 		tweets.search_metadata.next_results
	// 	);
	// 	if (maxIdMatch && maxIdMatch[1]) {
	// 		tweets = await search(client, query, sinceId, maxIdMatch[1]);
	// 		saveStatuses(tweets.statuses, mId);
	// 	} else {
	// 		break;
	// 	}
	// }

	// ferret.updateMonitor(pId, mId, nextSinceId, updatedAt);
	// update monitor
};
