import { authFetch } from './authFetch';

export const getProjects = async () => {
	const res = await authFetch('/api/projects');

	return await res.json();
};
export const getProject = async (id: string) => {
	const res = await authFetch(`/api/projects/${id}`);

	return await res.json();
};

export const createProject = (name: string, image: string) => {
	return authFetch('/api/projects', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			name,
			image,
		}),
	});
};
