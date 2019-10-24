export declare const enum ProjectAccessLevel {
    Read = "read",
    Write = "write",
    Admin = "admin"
}
export declare type Project = {
    id: string;
    title: string;
    image: string;
    access: ProjectAccessLevel;
};
