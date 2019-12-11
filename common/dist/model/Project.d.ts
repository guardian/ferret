export declare type ProjectAccessLevel = 'read' | 'write' | 'admin';
export declare type Project = {
    id: string;
    title: string;
    image: string;
    access: ProjectAccessLevel;
};
