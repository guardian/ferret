import { check } from 'express-validator';

export const postTagFormValidators = [
	check('label').isString(),
	check('color').isHexColor(),
];
