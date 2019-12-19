import { SourceConfig } from '.';
import { UkCompaniesHouseApi } from '../services/ukCompaniesHouseApi';

export const companyConfig = (api: UkCompaniesHouseApi): SourceConfig => ({
	name: 'uk-companies-house::company',
	match: 'https?://beta.companieshouse.gov.uk/company/',
	idExtractor: {
		type: 'querySelector',
		querySelector: '#company-number strong',
	},
	dragQuerySelectors: [ '#company-number strong'],
	processor: api.getCompany,
});

export const officerConfig = (api: UkCompaniesHouseApi): SourceConfig => ({
	name: 'uk-companies-house::officer',
	match: 'https?://beta.companieshouse.gov.uk/officers/.*',
	idExtractor: {
		type: 'urlRegex',
		regex: 'https?://beta.companieshouse.gov.uk/officers/(.+?)/.*',
	},
	dragQuerySelectors: ['#officer-name'],
	processor: api.getOfficer,
});
