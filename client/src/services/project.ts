import {
	TimelineEvidence,
	Timeline,
	TimelineEntry,
} from '@guardian/ferret-common';
import { authFetch } from './authFetch';

export const getProjects = async () => {
	const res = await authFetch('/api/projects');
	return await res.json();
};
export const getProject = async (id: string) => {
	const res = await authFetch(`/api/projects/${id}`);
	return await res.json();
};

export const createProject = (title: string, image: string) => {
	return authFetch('/api/projects', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			title,
			image,
		}),
	});
};

export const getTimelines = async (pId: string): Promise<Timeline[]> => {
	const res = await authFetch(`/api/projects/${pId}/timelines`);
	return await res.json();
};

export const createTimeline = (pId: string, title: string, image: string) => {
	return authFetch(`/api/projects/${pId}/timelines`, {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			title,
			image,
		}),
	});
};

export const createTimelineEntry = (
	pId: string,
	tId: string,
	happenedOn: Date,
	title: string,
	description: string,
	evidence: TimelineEvidence[] = []
) => {
	return authFetch(`/api/projects/${pId}/timelines/${tId}/entries`, {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			happenedOn: happenedOn.toISOString(),
			title,
			description,
			evidence,
		}),
	});
};

export const getTimelineEntries = async (pId: string, tId: string) => {
	const res = await authFetch(`/api/projects/${pId}/timelines/${tId}/entries`);
	return await res.json();
};

export const updateTimelineEntry = async (
	pId: string,
	tId: string,
	eId: string,
	entry: TimelineEntry
) => {
	return authFetch(`/api/projects/${pId}/timelines/${tId}/entries/${eId}`, {
		method: 'PUT',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify(entry),
	});
};

export const reorderTimelineEntries = async (
	pId: string,
	tId: string,
	ids: string[]
) => {
	return authFetch(`/api/projects/${pId}/timelines/${tId}/entries/reorder`, {
		method: 'PUT',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({ ids }),
	});
};
