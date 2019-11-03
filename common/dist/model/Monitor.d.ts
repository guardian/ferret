export declare type MonitorType = 'grid' | 'twitter';
export declare type GridMonitor = {
    id: string;
    title: string;
    type: 'grid';
    query: string;
};
export declare type TwitterMonitor = {
    id: string;
    title: string;
    type: 'twitter';
    query: string;
};
export declare type Monitor = GridMonitor | TwitterMonitor;
