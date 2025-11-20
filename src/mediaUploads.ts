import fs from "node:fs";
import { fileTypeFromBuffer } from "file-type";
import { twitterAPI } from "./bot";

const detectFileType = async (
	contents: Buffer,
): Promise<string | undefined> => {
	const fileType = await fileTypeFromBuffer(contents);
	return fileType?.mime;
};

const mediaCache = new Map<string, string>();

export async function getMediaId(fileName: string): Promise<string> {
	const cached = mediaCache.get(fileName);
	if (cached) return cached;
	const contents = await fs.promises.readFile(fileName);
	const mime = await detectFileType(contents);

	if (!mime) {
		throw new Error(`Could not detect file type for ${fileName}`);
	}

	const id = await twitterAPI.v1.uploadMedia(contents, { mimeType: mime });
	mediaCache.set(fileName, id);

	return id;
}
