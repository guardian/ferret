import { check } from 'express-validator';

export const postTimelineFormValidators = [check('title').isString()];
