export type MonitorType = 'grid' | 'twitter';

export type GridMonitor = {
	id: string;
	title: string;
	type: 'grid';
	query: string;
};

export type TwitterMonitor = {
	id: string;
	title: string;
	type: 'twitter';
	query: string;
};

export type Monitor = GridMonitor | TwitterMonitor;
