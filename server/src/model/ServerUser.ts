import { User, Permission } from '@guardian/ferret-common';

export class ServerUser {
	id: string;
	username: string;
	displayName: string;
	passwordHash: string;
	permissions: Permission[];

	constructor(
		id: string,
		username: string,
		displayName: string,
		passwordHash: string,
		permissions: Permission[]
	) {
		this.id = id;
		this.username = username;
		this.displayName = displayName;
		this.passwordHash = passwordHash;
		this.permissions = permissions;
	}

	toUser(): User {
		return {
			id: this.id,
			username: this.username,
			displayName: this.displayName,
			permissions: this.permissions,
		};
	}
}
