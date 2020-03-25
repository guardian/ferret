import crypto from 'crypto';
import fs, { promises as fsPromises } from 'fs';
import path from 'path';
import uuidv4 from 'uuid';
import readChunk from 'read-chunk';
import fileType from 'file-type';
import { Config } from './config';
import { FileStorageResult } from '../model/FileStorageResult';
import { exec } from 'child_process';

const convertHashToPath = (hash: string) => {
	const prefix = hash.match(/.{1,4}/g);

	if (prefix && prefix.length >= 4) {
		return path.join(...prefix.slice(0, 4), hash);
	} else {
		throw new Error(`Bad path: ${path}`);
	}
};

export class Storage {
	root: string;

	constructor(config: Config) {
		this.root = config.storage.root;
	}

	uploadFile = (
		inputStream: NodeJS.ReadableStream
	): Promise<FileStorageResult> => {
		return new Promise(async (resolve, reject) => {
			const tempDir = path.join(this.root, 'uploads');
			const tempPath = path.join(tempDir, `${uuidv4()}.tmp`);

			await fsPromises.mkdir(tempDir, { recursive: true });

			const hash = crypto.createHash('sha512');
			const outputStream = fs.createWriteStream(tempPath);

			inputStream.pipe(outputStream);
			inputStream.pipe(hash);

			outputStream.on('close', async () => {
				const hashDigest = hash.digest('hex');

				// Blob directory where the cached data and previews will also be stored.
				const blobDirectory = path.join(
					this.root,
					convertHashToPath(hashDigest)
				);
				await fsPromises.mkdir(blobDirectory, { recursive: true });

				const filePath = path.join(blobDirectory, 'raw');

				fsPromises
					.rename(tempPath, filePath)
					.then(() => {
						// Bit of a hack for now...
						exec('file -b --mime-type ' + filePath, (err, stdout, stderr) => {
							const ft = stdout.trim();

							return resolve({
								hash: hashDigest,
								location: filePath,
								mimeType: ft ? ft : 'application/octet-stream',
							});
						});
					})
					.catch(err => {
						console.error(`Failed to rename file: ${err}`);
						fsPromises.unlink(tempPath);
						reject(new Error('Failed to rename file'));
					});
			});
			outputStream.on('error', err => {
				fsPromises.unlink(tempPath);
				reject(`Error in output stream when saving file: ${err}`);
			});
		});
	};
}
