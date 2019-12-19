import AWS from 'aws-sdk';
import { promises as fs } from 'fs';

var credentials = new AWS.SharedIniFileCredentials({
	profile: 'investigations',
});

AWS.config.credentials = credentials;
var s3 = new AWS.S3();

export const uploadObject = (
	object: { [key: string]: any },
	bucketName: string,
	key: string
): Promise<any> => {
	return s3
		.upload({
			Bucket: bucketName,
			Key: key,
			ContentType: 'application/json',
			Body: JSON.stringify(object),
		})
		.promise();
};
export const uploadFile = async (
	filePath: string,
	contentType: string,
	bucketName: string,
	key: string
): Promise<any> => {
	const buffer = await fs.readFile(filePath);

	var params = {
		Bucket: bucketName,
		Key: key,
		ContentType: contentType,
		Body: buffer,
	};

	return s3.upload(params).promise();
};
