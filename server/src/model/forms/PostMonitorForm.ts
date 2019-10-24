import { check } from 'express-validator';

export const postMonitorFormValidators = [
	check('title').isString(),
	check('query').isString(),
];
