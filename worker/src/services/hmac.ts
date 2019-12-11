import crypto from 'crypto';

export const createHmac = (
	secret: string,
	isoDate: string,
	verb: string,
	url: string
) => {
	const hmac = crypto.createHmac('sha256', secret);
	const content = isoDate + '\n' + verb + '\n' + url;
	hmac.update(content, 'utf8');
	return 'HMAC ' + hmac.digest('base64');
};
