export declare enum Permission {
    SystemUser = "system_user",
    ManageUsers = "manage_users",
    ManageProjects = "manage_projects",
    ManageMonitors = "manage_monitors"
}
export declare class User {
    id: string;
    username: string;
    displayName: string;
    permissions: Permission[];
    constructor(id: string, username: string, displayName: string, permissions: Permission[]);
}
