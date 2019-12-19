// Gross copy-paste of some entity-integration code - fix this

export type SourceConfig = {
	name: string;
	match: string;
	idExtractor:
		| UrlRegexExtractorFields
		| QuerySelectorExtractorFields
		| ElementAttributeExtractorFields;
	dragQuerySelectors: string[];
};

type UrlRegexExtractorFields = {
	type: 'querySelector';
	querySelector: string;
};

type QuerySelectorExtractorFields = {
	type: 'urlRegex';
	regex: string;
};

type ElementAttributeExtractorFields = {
	type: 'elementAttribute';
	querySelector: string;
	attribute: string;
	attributeRegex?: string;
};

export type OverlayPoint = {
	rect:  null | ClientRect | DOMRect;
	entityData: any;
};
