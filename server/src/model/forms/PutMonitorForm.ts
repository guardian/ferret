import { check } from 'express-validator';

export const putMonitorFormValidators = [
	check('sinceId').isString(),
	check('updatedAt').isISO8601(),
	check('count').isNumeric(),
];
