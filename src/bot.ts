#!/usr/bin/env bun
import { TwitterApi } from "twitter-api-v2";
import config from "./config.js";
import { generateHotTake } from "./hotTakes.js";
import { getMediaId } from "./mediaUploads.js";
import { expectArrayOfMaxLen4 } from "./util.js";

export const twitterAPI = new TwitterApi({
	appKey: config.consumerKey,
	appSecret: config.consumerSecret,
	accessToken: config.token,
	accessSecret: config.secret,
});

const postHotTake = async () => {
	const { take, images } = await generateHotTake();
	console.log(`Posting hot take: ${take} with images ${images}`);
	const mediaIDs = images ? await Promise.all(images.map(getMediaId)) : [];
	console.log(`Media IDs: ${mediaIDs}`);

	const mediaObj =
		mediaIDs.length > 0
			? { media_ids: expectArrayOfMaxLen4(mediaIDs) }
			: undefined;
	await twitterAPI.readWrite.v2.tweet({
		media: mediaObj,
		text: `${take} ${config.suffix}`,
	});
	console.log(`Tweeted "${take}" with ${mediaIDs.length} images`);
};

const tweetLoop = async () => {
	await postHotTake();
	setTimeout(tweetLoop, config.postTime);
};

await tweetLoop();
