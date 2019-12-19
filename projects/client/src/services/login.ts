export const login = (username: string, password: string) => {
	return fetch(`/api/login`, {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			username,
			password,
		}),
	}).then(res => res.json());
};
