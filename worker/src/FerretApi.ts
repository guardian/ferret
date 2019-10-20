import fetch from 'node-fetch';

export class Ferret {
	baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	//getProjects = (): Promise<any> => {
	//	return fetch(`${this.baseUrl}/api/projects`).then(res => res.json());
	//};

	//getMonitors = (pId: string): Promise<any> => {
	//	return fetch(`${this.baseUrl}/api/projects/${pId}/monitors`).then(res =>
	//		res.json()
	//	);
	//};

	//insertTweet = (pId: string, mId: string, tweet: any) => {
	//	console.log('insertan tweet ' + tweet.id_str);
	//	return fetch(`${this.baseUrl}/api/projects/${pId}/monitors/${mId}/tweets`, {
	//		method: 'POST',
	//		headers: { 'Content-Type': 'application/json' },
	//		body: JSON.stringify(tweet),
	//	});
	//};

	//updateMonitor = (
	//	pId: string,
	//	mId: string,
	//	sinceId: string,
	//	updatedAt: Date
	//) => {
	//	const updatedAtFormatted = updatedAt.toISOString();

	//	return fetch(`${this.baseUrl}/api/projects/${pId}/monitors/${mId}`, {
	//		method: 'PUT',
	//		headers: { 'Content-Type': 'application/json' },
	//		body: JSON.stringify({
	//			sinceId,
	//			updatedAt: updatedAtFormatted,
	//		}),
	//	});
	//};
}
