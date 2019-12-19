import Twitter from 'twitter';
import { Ferret } from './FerretApi';
import { getConfig } from './services/Config';
import { FeedJob } from '@guardian/ferret-common';

import AsyncPolling from 'async-polling';
import { GridProcessor } from './processors/Grid';

const config = getConfig();

const client = new Twitter({
	consumer_key: config.twitter.consumerKey,
	consumer_secret: config.twitter.consumerSecret,
	access_token_key: config.twitter.accessTokenKey,
	access_token_secret: config.twitter.accessTokenSecret,
});

const ferret = new Ferret('http://localhost:9999', config);

// Setup processors
const gridProcessor = new GridProcessor(config);

// Begin poller
AsyncPolling(async end => {
	console.log('polling!');
	const jobs: FeedJob[] = await ferret.getJobs();

	for (let i = 0; i < jobs.length; i++) {
		const job = jobs[i];

		const heartbeater = AsyncPolling(async end => {
			await ferret.heartbeatJob(job.jobId);
			end();
		}, 1000);

		heartbeater.run();

		console.log(`Processing job ${job.jobId}`);

		const processedOn = new Date();

		try {
			switch (job.feed.type) {
				case 'grid':
					const images = await gridProcessor.getImages(
						job.addedOn,
						processedOn.toISOString(),
						job.feed.parameters.query
					);
					// upload images
					images.forEach(i => {
						ferret.insertDocument(job.feed.datasetId, i.id, i);
					});

					break;
			}
			// Write job sucess
			ferret.updateJob(job.jobId, 'done', processedOn.toISOString());
		} catch (err) {
			console.error(`Failure while processing job ${job.jobId}`);
			ferret.updateJob(job.jobId, 'failed', processedOn.toISOString());
		}

		heartbeater.stop();
	}

	end();
}, 5000).run();
