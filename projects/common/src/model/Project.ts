export type ProjectAccessLevel = 'read' | 'write' | 'admin';

export type Project = {
	id: string;
	title: string;
	image: string;
	access: ProjectAccessLevel;
};
