import { authFetch } from './authFetch';

export const searchImages = async (q: string, page: number) => {
	const res = await authFetch(`/api/images/search?q=${q}&page=${page}`);
	return await res.json();
};
