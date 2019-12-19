import { check } from 'express-validator';

export const putFeedJobFormValidators = [
	check('processedOn').isString(),
	check('status').isString(),
];
