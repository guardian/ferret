import { check } from 'express-validator';

export const insertMonitorFormValidators = [
	check('name').isString(),
	check('query').isString(),
];
