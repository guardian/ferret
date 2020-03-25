export type FeedParameters = GridFeedParameters; // | OtherFeedParameters

export type GridFeedParameters = {
	query: string;
};

export type FeedType = 'grid' | 'twitter';

export type Feed = {
	id: string;
	title: string;
	type: string;
	datasetId: string;
	frequency: string;
	parameters: FeedParameters;
	// createdOn, createdBy
};

export type FeedJobStatus =
	| 'ready'
	| 'processing'
	| 'done'
	| 'failed'
	| 'timeout';

export type FeedJob = {
	jobId: string;
	status: FeedJobStatus;
	addedOn: string;
	feed: Feed;
};
