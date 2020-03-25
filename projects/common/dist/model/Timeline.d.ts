export declare type Timeline = {
    id: string;
    title: string;
    createdBy: string;
    createdOn: Date;
};
export declare type TimelineEntry = {
    id: string;
    happenedOn?: string;
    title: string;
    description: string;
    evidence: TimelineEvidence[];
};
export declare type EvidenceType = 'giant_resource' | 'grid_image' | 'tweet' | 'url';
export declare type TimelineEvidence = {
    type: EvidenceType;
    title: string;
    data: GridImageEvidence | TweetEvidence | UrlEvidence;
};
export declare type GiantResource = {
    id: string;
    thumb_url: string;
};
export declare type UrlEvidence = {
    url: string;
};
export declare type GridImageEvidence = any;
export declare type TweetEvidence = any;
