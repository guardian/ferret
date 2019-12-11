import fetch from 'node-fetch';
import { createHmac } from './services/hmac';
import { Config } from './services/Config';
import { STATUS_CODES } from 'http';
import { FeedJobStatus } from '@guardian/ferret-common';

export class Ferret {
	config: Config;
	baseUrl: string;

	constructor(baseUrl: string, config: Config) {
		this.config = config;
		this.baseUrl = baseUrl;
	}

	createAuthHeaders = (verb: string, url: string) => {
		const ts = new Date().toISOString();

		return {
			Authorization: createHmac(this.config.app.secret, ts, verb, url),
			'X-Authorization-Timestamp': ts,
		};
	};

	getJobs = () => {
		const path = '/api/jobs';
		return fetch(`${this.baseUrl}${path}`, {
			headers: this.createAuthHeaders('GET', path),
		}).then(res => res.json());
	};

	heartbeatJob = (id: string) => {
		const path = `/api/jobs/${id}/heartbeat`;
		return fetch(`${this.baseUrl}${path}`, {
			method: 'PUT',
			headers: this.createAuthHeaders('PUT', path),
		});
	};

	updateJob = (id: string, status: FeedJobStatus, processedOn: string) => {
		const path = `/api/jobs/${id}`;
		return fetch(`${this.baseUrl}${path}`, {
			method: 'PUT',
			headers: this.createAuthHeaders('PUT', path),
			body: JSON.stringify({
				status,
				processedOn,
			}),
		});
	};

	insertDocument = (datasetId: string, docId: string, data: any) => {
		const path = `/api/datasets/${datasetId}/docs`;
		return fetch(`${this.baseUrl}${path}`, {
			method: 'POST',
			headers: this.createAuthHeaders('POST', path),
			body: JSON.stringify({
				id: docId,
				data,
			}),
		});
	};
}
