import path from 'path';
import { promises as fs } from 'fs';
import Twitter from 'twitter';
import { getConfig } from './Config';
import { download } from './download';
import { uploadObject, uploadFile } from './S3';
import os from 'os';
import { extractMedia } from './extractMedia';
import { processTweets } from './Twitter';
import { Ferret } from './FerretApi';

const config = getConfig();

const client = new Twitter({
	consumer_key: config.twitter.consumerKey,
	consumer_secret: config.twitter.consumerSecret,
	access_token_key: config.twitter.accessTokenKey,
	access_token_secret: config.twitter.accessTokenSecret,
});

//const database = new Database(config);
const ferret = new Ferret('http://localhost:9999');

const getTweets = (
	pId: string,
	mId: string,
	query: string,
	sinceId?: string
) => {
	// Todo extract form job queue

	processTweets(ferret, client, pId, mId, query, sinceId);

	//database.updateMonitor(mId, sinceId);
	// do search
	// write results
	// update monitor row with new "now time"
};

getTweets(
	'83bbc735-af43-40d9-88fc-68db03c20ea8',
	'84b7eaa1-8941-4da9-b562-7093bc28da0f',
	'#TwitterKurds'
);
