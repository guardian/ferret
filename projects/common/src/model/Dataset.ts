export type DatasetType = 'empty' | 'immutable' | 'feed' | 'scrape';

export type Dataset = {
	id: string;
	title: string;
	type: DatasetType;
	image: string;
};

export type FileType = 'directory' | 'blob' | 'timeline' | 'link';

export type FileLink = {
	datasetId: string;
	path: string;
};

export type DatasetFile = {
	path: string;
	addedOn: Date;
	type: FileType;

	blobId?: string;
	timelineId?: string;
	linkPath?: FileLink;
};
