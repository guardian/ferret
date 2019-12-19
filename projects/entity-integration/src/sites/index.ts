export type SourceConfig = {
	name: string;
	match: string;
	idExtractor:
		| UrlRegexExtractorFields
		| QuerySelectorExtractorFields
		| ElementAttributeExtractorFields;
	dragQuerySelectors: string[];
	processor: (id: string) => Promise<any>;
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
