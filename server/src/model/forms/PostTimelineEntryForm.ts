import { check } from 'express-validator';

export const postTimelineEntryFormValidators = [
	check('happenedOn').isISO8601(),
	check('title').isString(),
	check('description').isString(),
	check('evidence').isArray(),
];
