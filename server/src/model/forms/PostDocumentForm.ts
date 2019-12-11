import { check } from 'express-validator';

export const postDocumentFormValidators = [
	check('id').isString(),
	check('datac').isJSON(),
];
