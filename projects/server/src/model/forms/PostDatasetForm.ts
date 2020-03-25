import { check } from 'express-validator';

export const postDatasetFormValidators = [
	check('title').isString(),
	check('image').isString(),
];
