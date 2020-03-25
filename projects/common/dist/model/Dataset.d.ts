export declare type DatasetType = 'empty' | 'immutable' | 'feed' | 'scrape';
export declare type Dataset = {
    id: string;
    title: string;
    type: DatasetType;
    image: string;
};
export declare type FileType = 'directory' | 'blob' | 'timeline' | 'link';
export declare type FileLink = {
    datasetId: string;
    path: string;
};
export declare type DatasetFile = {
    path: string;
    addedOn: Date;
    type: FileType;
    blobId?: string;
    timelineId?: string;
    linkPath?: FileLink;
};
