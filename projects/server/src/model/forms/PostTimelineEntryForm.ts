import { check } from 'express-validator';

export const postTimelineEntryFormValidators = [
	check('happenedOn')
		.optional()
		.isString(),
	check('title').isString(),
	check('description').isString(),
	check('evidence').isArray(),
];
