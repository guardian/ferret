import fetch from 'node-fetch';

export class Osmon {
	baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}
	getProjects = (): Promise<any> => {
		return fetch(`${this.baseUrl}/projects`).then(res => res.json());
	};

	getMonitors = (pId: string): Promise<any> => {
		return fetch(`${this.baseUrl}/projects/${pId}/monitors`).then(res =>
			res.json()
		);
	};

	updateMonitor = (
		pId: string,
		mId: string,
		sinceId: string,
		updatedAt: Date
	) => {
		const updatedAtFormatted = updatedAt.toISOString();

		return fetch(`${this.baseUrl}/projects/${pId}/monitors/${mId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				sinceId,
				updatedAt,
			}),
		});
	};
}
