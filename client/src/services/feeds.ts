import { FeedParameters, FeedType } from '@guardian/ferret-common';
import { authFetch } from './authFetch';

export const listFeeds = () => {
	return authFetch(`/api/feeds`).then(res => res.json());
};

export const getFeed = (mId: string) => {
	return authFetch(`/api/feeds/${mId}`).then(res => res.json());
};

export const createFeed = (
	title: string,
	type: FeedType,
	frequency: string,
	parameters: FeedParameters
) => {
	return authFetch(`/api/feeds`, {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({ title, type, frequency, parameters }),
	});
};
