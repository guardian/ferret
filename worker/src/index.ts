import path from 'path';
import { promises as fs } from 'fs';
import Twitter from 'twitter';
import { Database } from './Database';
import { getConfig } from './Config';
import { download } from './download';
import { uploadObject, uploadFile } from './S3';
import os from 'os';
import { extractMedia } from './extractMedia';
import { processTweets } from './twitter';

const config = getConfig();

const client = new Twitter({
	consumer_key: config.twitter.consumerKey,
	consumer_secret: config.twitter.consumerSecret,
	access_token_key: config.twitter.accessTokenKey,
	access_token_secret: config.twitter.accessTokenSecret,
});

const database = new Database(config);

const getTweets = (mId: string, query: string, sinceId: number) => {
	const now = Date.now();
	processTweets(client, mId, query, sinceId);

	database.updateMonitor(mId, sinceId);
	// do search
	// write results
	// update monitor row with new "now time"
};

console.log(config.twitter);
getTweets('test', '#TwitterKurds', new Date().setFullYear(2018));
