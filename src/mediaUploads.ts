import mmm from 'mmmagic';
import fs from "fs";
import {twitterAPI} from "./bot.js";

const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
const detectFileType = (filepath: string): Promise<string> =>
	new Promise((resolve, reject) => {
		magic.detectFile(filepath, (err, result) => {
			if (err) return reject(err);
			if (typeof result === 'string') return resolve(result);
			return reject(new Error('Unexpected result type'));
		});
	});

const mediaCache = new Map<string, string>()


export async function getMediaId(fileName: string): Promise<string> {
	if (mediaCache.has(fileName)) {
		return mediaCache.get(fileName)!
	}
	const contents = await fs.promises.readFile(fileName)
	const mime = await detectFileType(fileName)

	const id = await twitterAPI.v1.uploadMedia(contents, {mimeType: mime})
	mediaCache.set(fileName, id)

	return id
}