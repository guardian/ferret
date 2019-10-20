export const listMonitors = () => {
	return fetch(`/api/monitors`).then(res => res.json());
};

export const getMonitor = (mId: string) => {
	return fetch(`/api//monitors/${mId}`).then(res => res.json());
};

export const listMonitorTweets = (mId: string) => {
	return fetch(`/api/monitors/${mId}/tweets`).then(res => res.json());
};

export const createMonitor = (name: string, query: string) => {
	return fetch(`/api/monitors`, {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			name,
			query,
		}),
	});
};
