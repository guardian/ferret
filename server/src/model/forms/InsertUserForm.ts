import { check } from 'express-validator';

export const insertUserFormValidators = [
	check('username').isAlphanumeric(),
	check('displayName').isString(),
	check('password').isString(),
];
