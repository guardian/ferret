import { SourceConfig } from '.';

export const processor = (id: string) => {
	console.log(`processing ${id}`);
	return { data: 'wikipeida innit' };
};

export const entityConfig: SourceConfig = {
	name: 'wikipedia',
	match: 'https?://en.wikipedia.org/wiki/*',
	idExtractor: {
		type: 'elementAttribute',
		querySelector: '#t-wikibase a',
		attribute: 'href',
		attributeRegex: '.*?/(Q\\d+)$',
	},
	dragQuerySelectors: ['#firstHeading'],
	processor: async () => {}, //processor,
};
