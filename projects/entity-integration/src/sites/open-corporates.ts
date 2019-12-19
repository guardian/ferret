import { SourceConfig } from '.';

// Use configured open-corporates API key to get entity data

export const companyConfig: SourceConfig = {
	name: 'open-corporates::company',
	match: 'https?://opencorporates.com/companies/gb/',
	idExtractor: {
		type: 'querySelector',
		querySelector: '.company_number',
	},
	dragQuerySelectors: ['.org'],
	processor: async () => {}, // OpenCorporatesApi.getCompany,
};
