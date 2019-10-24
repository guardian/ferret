export type Timeline = {
	id: string;
	title: string;
	image: string;
	createdBy: string;
	createdOn: Date;
};

export type TimelineEntry = {
	id: string;
	happenedOn: Date;
	title: string;
	description: string;
	evidence: TimelineEvidence[];
};

export type EvidenceType = 'giant_resource' | 'grid_image' | 'tweet' | 'url';

export type TimelineEvidence = {
	type: EvidenceType;
	title: string;
	data: GridImageEvidence | TweetEvidence | UrlEvidence;
};

export type GiantResource = {
	id: string;
	thumb_url: string;
};

export type UrlEvidence = {
	url: string;
};

// Maybe type these properly, one day...
export type GridImageEvidence = any;
export type TweetEvidence = any;
