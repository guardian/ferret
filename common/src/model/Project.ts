export const enum ProjectAccessLevel {
	Read = 'read',
	Write = 'write',
	Admin = 'admin',
}

export type Project = {
	id: string;
	title: string;
	image: string;
	access: ProjectAccessLevel;
};
