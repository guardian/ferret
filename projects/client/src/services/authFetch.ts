let token: string | undefined = undefined;

export const setAuthToken = (newToken: string) => {
	token = newToken;
};

export const authFetch = async (url: string, init?: RequestInit) => {
	// todo if no token just bail now
	const request = new Request(url, init);

	request.headers.set('Authorization', 'Bearer ' + token);

	const authRequest = new Request(request, {
		headers: request.headers,
	});

	const res = await fetch(authRequest);

	if (!res.ok) {
		// TODO clear token out of reducer
		throw Error('Failed to fetch');
	}

	return res;
};
