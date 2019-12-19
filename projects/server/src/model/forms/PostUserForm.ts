import { check } from 'express-validator';

export const postUserFormValidators = [
	check('username').isAlphanumeric(),
	check('displayName').isString(),
	check('password').isString(),
];
