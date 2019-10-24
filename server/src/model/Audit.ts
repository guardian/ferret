import { User } from '@guardian/ferret-common';

export enum AuditAction {
	Create = 'create',
	Update = 'update',
	Delete = 'delete',
}

export type Audit = {
	user: User;
};
