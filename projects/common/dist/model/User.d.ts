export declare type Permission = 'system_user' | 'manage_users' | 'manage_projects' | 'manage_feeds';
export declare type User = {
    id: string;
    username: string;
    displayName: string;
    permissions: Permission[];
};
