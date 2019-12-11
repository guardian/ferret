import { check } from 'express-validator';

export const postFeedFormValidators = [
	check('title').isString(),
	check('type').isString(),
	check('frequency').isString(),
	check('parameters').isJSON(),
];
