import { check } from 'express-validator';

export const insertTagFormValidators = [
	check('label').isString(),
	check('color').isHexColor(),
];
