import mmm from 'mmmagic';
import fs from "fs";
import {TwitterApi} from "twitter-api-v2";
import config from "./config.js";

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


const oldClient = new TwitterApi({
	appKey: config.v1ApiKey,
	appSecret: config.v1ApiSecret,
	accessToken: config.v1AccessToken,
	accessSecret: config.v1Secret,
})


export async function getMediaId(fileName: string): Promise<string> {
	if (mediaCache.has(fileName)) {
		return mediaCache.get(fileName)!
	}
	const contents = await fs.promises.readFile(fileName)
	const mime = await detectFileType(fileName)

	const id = await oldClient.v1.uploadMedia(contents, {mimeType: mime, additionalOwners: config.userId})
	mediaCache.set(fileName, id)

	return id
}