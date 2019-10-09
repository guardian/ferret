import { check } from 'express-validator';

export const updateMonitorFormValidators = [
	check('sinceId').isString(),
	check('updatedAt').isISO8601(),
	check('count').isNumeric(),
];
