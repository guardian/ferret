export const getSources = (endpoint: string) => {
	return fetch(`${endpoint}/sites`).then(res => res.json());
};

export const getEntity = (
	endpoint: string,
	source: string,
	id: string
): any => {
	return fetch(`${endpoint}/sites/${source}/${id}`).then(res => res.json());
};
