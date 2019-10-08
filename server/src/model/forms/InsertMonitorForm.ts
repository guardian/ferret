import { check } from 'express-validator';

export const insertMonitorFormValidators = [
	check('name').isAlphanumeric(),
	check('query').isString(),
];
