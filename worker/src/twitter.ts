import Twitter from 'twitter';
import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';
import { uploadObject, uploadFile } from './S3';
import { extractMedia } from './extractMedia';
import { download } from './download';

export const processTweets = (
	client: Twitter,
	mId: string,
	query: string,
	maxId?: string
) => {
	client.get(
		'search/tweets',
		{ q: query, count: 100, include_entities: true, maxId },
		(err, tweets) => {
			if (err) {
				console.error(`Failed to get tweets for ${mId}`, err);
			} else {
				console.log(tweets);
				return;
				const { statuses } = tweets;
				statuses.forEach(async (status: any) => {
					const { extended_entities } = status;
					// write tweet to s3 bucket
					const { id_str } = status;

					console.log(`Processign status: ${id_str}`);
					const tweetPath = `${mId}/${id_str}/`;
					const statusPath = tweetPath + 'status.json';

					try {
						console.log('uploading text');
						await uploadObject(status, 'osmon-temp', statusPath);
					} catch (err) {
						console.error('Failed to upload status to s3', err);
					}

					if (extended_entities && extended_entities.media) {
						const mediaObjects = extractMedia(extended_entities.media);

						for (let i = 0; i < mediaObjects.length; i++) {
							const fileName = mediaObjects[i].name;
							const filePath = path.resolve(os.tmpdir(), fileName);

							console.log('downloading file');
							await download(mediaObjects[i].url, filePath);

							try {
								console.log('upload file');
								await uploadFile(
									filePath,
									mediaObjects[i].contentType,
									'osmon-temp',
									tweetPath + mediaObjects[i].name
								);
							} catch (err) {
								console.error('failed to upload file to s3', err);
							} finally {
								await fs.unlink(filePath);
							}
						}
					}
				});
				// Recurse!
			}
		}
	);
};
