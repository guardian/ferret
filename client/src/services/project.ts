export const getProjects = () => {
	return fetch('/api/projects').then(res => res.json());
};

export const createProject = (name: string, image: string) => {
	return fetch('/api/projects', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			name,
			image,
		}),
	});
};
