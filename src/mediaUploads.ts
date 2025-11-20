import {fileTypeFromFile} from 'file-type';
import fs from "fs";
import {twitterAPI} from "./bot.js";

const detectFileType = async (filepath: string): Promise<string | undefined> => {
	const fileType = await fileTypeFromFile(filepath);
	return fileType?.mime;
};

const mediaCache = new Map<string, string>()


export async function getMediaId(fileName: string): Promise<string> {
	if (mediaCache.has(fileName)) {
		return mediaCache.get(fileName)!
	}
	const contents = await fs.promises.readFile(fileName)
	const mime = await detectFileType(fileName)

	if (!mime) {
		throw new Error(`Could not detect file type for ${fileName}`);
	}

	const id = await twitterAPI.v1.uploadMedia(contents, {mimeType: mime})
	mediaCache.set(fileName, id)

	return id
}