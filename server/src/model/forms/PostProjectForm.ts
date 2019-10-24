import { check } from 'express-validator';

export const postProjectFormValidators = [
	check('title').isString(),
	check('image').isString(),
];
