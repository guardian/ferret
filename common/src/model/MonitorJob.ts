export enum JobType {
	// Refreshing to get new content
	TwitterRefresh = 'twitter::refresh',
	// Searching back in time for old content
	TwitterBackfill = 'twitter::backfill',
}

export enum JobStatus {
	Ready = 'ready',
	Done = 'done',
	Failed = 'failed',
}

export type MonitorJob = {
	monitorId: string;
	jobType: JobType;
	status: JobStatus;
	submittedAt: Date;
	executeAt: Date;
};
