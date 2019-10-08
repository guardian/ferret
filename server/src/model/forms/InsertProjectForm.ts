import { check } from 'express-validator';

export const insertProjectFormValidators = [check('name').isAlphanumeric()];
