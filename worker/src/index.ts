import Twitter from 'twitter';
import { Database } from './Database';
import { getConfig } from './Config';

const config = getConfig();

const client = new Twitter({
	consumer_key: config.twitter.consumerKey,
	consumer_secret: config.twitter.consumerSecret,
	access_token_key: config.twitter.accessTokenKey,
	access_token_secret: config.twitter.accessTokenSecret,
});

const database = new Database(config);

const getTweets = (monitorId: string, query: string, since: number) => {
	const now = Date.now();
	// do search
	// write results
	// update monitor row with new "now time"
};
