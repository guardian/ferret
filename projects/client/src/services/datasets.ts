import { DatasetType } from '@guardian/ferret-common';
import { authFetch } from './authFetch';

export const getDatasets = async () => {
	const res = await authFetch('/api/datasets');
	return await res.json();
};

export const getDataset = async (dId: string) => {
	const res = await authFetch(`/api/datasets/${dId}`);
	return await res.json();
};

export const createDataset = (title: string, image: string) => {
	return authFetch('/api/datasets', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			title,
			image,
		}),
	});
};

export const setDatasetType = (dId: string, type: DatasetType) => {
	return authFetch(`/api/datasets/${dId}/type`, {
		method: 'PUT',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			type,
		}),
	});
};

export const uploadFiles = async (dId: string, files: any[]) => {
	//await setDatasetType(dId, 'immutable');
	for (let file of files) {
		await uploadFile(dId, file);
	}
};

const uploadFile = async (dId: string, file: any) => {
	var data = new FormData();
	data.append('file', file);

	await authFetch(`/api/datasets/${dId}/files`, {
		method: 'POST',
		headers: new Headers({
			'Content-Location': file.name,
		}),
		body: data,
	});
};
