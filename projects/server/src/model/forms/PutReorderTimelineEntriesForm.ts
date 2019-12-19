import { check } from 'express-validator';

export const putReorderTimelineEntriesFormValidators = [check('ids').isArray()];
