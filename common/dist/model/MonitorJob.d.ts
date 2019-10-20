export declare enum JobType {
    TwitterRefresh = "twitter::refresh",
    TwitterBackfill = "twitter::backfill"
}
export declare enum JobStatus {
    Ready = "ready",
    Done = "done",
    Failed = "failed"
}
export declare class MonitorJob {
    monitorId: string;
    jobType: JobType;
    status: JobStatus;
    submittedAt: Date;
    executeAt: Date;
    constructor(monitorId: string, jobType: JobType, status: JobStatus, submitttedAt: Date, executeAt: Date);
    priority: () => 10 | 1;
}
