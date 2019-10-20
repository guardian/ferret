//import { JobType, MonitorJob } from 'ferret-common';
//import { Pool } from 'pg';
//
//export class JobQueries {
//	pool: Pool;
//
//	constructor(pool: Pool) {
//		this.pool = pool;
//	}
//
//	listJobs = async (): Promise<MonitorJob[]> => {
//		const { rows } = await this.pool.query(
//			'SELECT monitor_id, status, job_type, submitted_at, execute_at FROM jobs'
//		);
//
//		return rows.map(
//			row =>
//				new MonitorJob(
//					row['monitor_id'],
//					row['status'],
//					row['job_type']),
//					new Date(row['submitted_at']),
//					new Date(row['execute_at'])
//				)
//		);
//	};
//
//	completeJob = async (monitorId: string): Promise<void> => {
//		await this.pool.query({
//			text: "UPDATE jobs SET status = 'done' WHERE monitor_id = $1",
//			values: [monitorId],
//		});
//		return;
//	};
//
//	insertJob = async (
//		monitorId: string,
//		jobType: JobType,
//		submittedAt: Date,
//		executeAt: Date,
//		lastId: string
//	): Promise<void> => {
//		await this.pool.query({
//			text:
//				"INSERT INTO jobs (monitor_id, job_type, submitted_at, execute_at, last_id, status) VALUES ($1, $2, $3, $4, $5, 'ready')",
//			values: [monitorId, jobType, submittedAt, executeAt, lastId],
//		});
//
//		return;
//	};
//}
//
