import fetch from 'node-fetch';

export const fetchGridImages = async (
	apiHost: string,
	apiKey: string,
	q: string
) => {
	const since = new Date();
	since.setDate(since.getDate() - 1);

	const until = new Date();
	const url = `${apiHost}/images?q=${q}&offset=0&length=100&orderBy=uploadTime&since=${since.toISOString()}&until=${until.toISOString()}&apiKey=${apiKey}`;

	const res = await fetch(url);
	if (res.status === 200) {
		const result = await res.json();
		const images = result.data;
		images.forEach((image: any) => {
			const data = image.data;
		});
		// Process
	} else {
		// Do nothing
	}
};
