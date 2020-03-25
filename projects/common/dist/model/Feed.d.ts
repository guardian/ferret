export declare type FeedParameters = GridFeedParameters;
export declare type GridFeedParameters = {
    query: string;
};
export declare type FeedType = 'grid' | 'twitter';
export declare type Feed = {
    id: string;
    title: string;
    type: string;
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
