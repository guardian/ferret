type MediaObject = {
	kind: string;
	id: string;
	url: string;
	contentType: string;
	name: string;
};
const lastPartOfUrl = (url: string) => {
	const bits = url.split('/');
	return bits[bits.length - 1];
};
export const extractMedia = (media: any): MediaObject[] => {
	const objects = [] as MediaObject[];

	media.forEach((media: any) => {
		const { id_str } = media;
		if (media.type === 'video') {
			const { variants } = media.video_info;
			let maxBitrate = 0;
			variants.forEach((v: any) => {
				if (v.bitrate > maxBitrate) {
					maxBitrate = v.bitrate;
				}
			});
			const { url, content_type } = variants.find(
				(v: any) => v.bitrate === maxBitrate
			);

			objects.push({
				id: id_str,
				kind: media.type,
				contentType: content_type,
				url: url,
				name: lastPartOfUrl(url),
			});
		} else if (media.type === 'photo') {
			const { media_url_https } = media;
			objects.push({
				id: id_str,
				kind: media.type,
				contentType: 'image/jpeg',
				url: media_url_https,
				name: lastPartOfUrl(media_url_https),
			});
		} else {
			console.error(`Unknown media type: ${media.type}`);
		}
	});

	return objects;
};
