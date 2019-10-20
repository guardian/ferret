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

export class MonitorJob {
	monitorId: string;
	jobType: JobType;
	status: JobStatus;
	submittedAt: Date;
	executeAt: Date;

	constructor(
		monitorId: string,
		jobType: JobType,
		status: JobStatus,
		submitttedAt: Date,
		executeAt: Date
	) {
		this.monitorId = monitorId;
		this.jobType = jobType;
		this.status = status;
		this.submittedAt = submitttedAt;
		this.executeAt = executeAt;
	}

	// Priority of tasks is a number, higher is more important
	priority = () => {
		switch (this.jobType) {
			case JobType.TwitterRefresh:
				return 10;
			case JobType.TwitterBackfill:
				return 1;
		}
	};
}
