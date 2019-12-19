export declare type FeedType = 'grid';
export declare type FeedParameters = GridFeedParameters;
export declare type GridFeedParameters = {
    query: string;
};
export declare type Feed = {
    id: string;
    title: string;
    type: FeedType;
    datasetId: string;
    frequency: string;
    parameters: FeedParameters;
};
export declare type FeedJobStatus = 'ready' | 'processing' | 'done' | 'failed' | 'timeout';
export declare type FeedJob = {
    jobId: string;
    status: FeedJobStatus;
    addedOn: string;
    feed: Feed;
};
