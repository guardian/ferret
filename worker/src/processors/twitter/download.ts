import Axios from 'axios';
import Path from 'path';
import fs from 'fs';

export const download = async (url: string, filename: string) => {
	const path = Path.resolve(__dirname, filename);
	const writer = fs.createWriteStream(path);

	const response = await Axios({
		url,
		method: 'GET',
		responseType: 'stream',
	});

	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
};
