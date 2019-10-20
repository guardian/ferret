export class Timeline {
	id: string;
	name: string;
	createdBy: string;
	createdOn: Date;

	constructor(id: string, name: string, createdBy: string, createdOn: Date) {
		this.id = id;
		this.name = name;
		this.createdBy = createdBy;
		this.createdOn = createdOn;
	}
}

export type TimelineEvent = {
	id: string;
	beginningOn: Date;
	endingOn: Date;
	title: string;
	description: string;
	evidence: TimelineEvidence[];
};

export enum EvidenceType {
	GridImage = 'grid_image',
	Tweet = 'tweet',
}

export type TimelineEvidence = {
	type: EvidenceType;
	data: GridImageEvidence | TweetEvidence;
};

// Maybe type these properly, one day...
export type GridImageEvidence = any;
export type TweetEvidence = any;
