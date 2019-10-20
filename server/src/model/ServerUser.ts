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

	toUser() {
		return new User(this.id, this.username, this.displayName, this.permissions);
	}
}
