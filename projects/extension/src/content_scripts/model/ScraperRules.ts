type PreflightRule = {
	type: 'must-exist' | 'must-not-exist';
	selector: string;
	errorMessage: string;
	matchValue?: string;
};

export const facebookPreflightRules = [
	{
		type: 'must-not-exist',
		selector: '#login_form',
		errorMessage:
			'Found login form, please ensure you are logged in to Facebook',
	},
];

type ScraperRule = {
	selector: string;
	subRules: ScraperRule[];
};

export const facebookScraperRules = [
	{
		name: 'Post',
		multiple: true,
		selector: 'div[role="article"][data-time]',
		subRules: [
			{
				name: 'Profile ID',
				multiple: false,
				selector: 'a[data-hovercard-prefer-more-content-show]',
				extractAttribute: 'href',
				regexExtract: 'https://www.facebook.com/(.*?)\\?',
			},
		],
	},
];

type ScraperExtractionRuleType = 'extract-text' | 'extract-attribute';
