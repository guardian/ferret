export const listMonitors = (projectId: string) => {
	return fetch(`/api/projects/${projectId}/monitors`).then(res => res.json());
};

export const createMonitor = (
	projectId: string,
	name: string,
	query: string
) => {
	return fetch(`/api/projects/${projectId}/monitors`, {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			name,
			query,
		}),
	});
};
