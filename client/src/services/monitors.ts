export const listMonitors = (pId: string) => {
	return fetch(`/api/projects/${pId}/monitors`).then(res => res.json());
};

export const createMonitor = (pId: string, name: string, query: string) => {
	return fetch(`/api/projects/${pId}/monitors`, {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			name,
			query,
		}),
	});
};
