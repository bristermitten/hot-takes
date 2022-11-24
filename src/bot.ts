import generateHotTake from "./hotTakes.js";
import config from './config.js'
import {Client} from "twitter-api-sdk";
import {getMediaId} from "./mediaUploads.js";


const client = new Client(config.bearerToken);


const postHotTake = async () => {
	const {take, images} = await generateHotTake()
	const mediaIDs = await Promise.all(images.map(getMediaId))

	const mediaObj = (mediaIDs.length > 0) ? {media_ids: mediaIDs} : undefined
	await client.tweets.createTweet({media: mediaObj, text: take + ' ' + config.suffix})
	console.log(`Tweeted "${take}" with ${mediaIDs.length} images`)
}

const tweetLoop = async () => {
	await postHotTake()
	setTimeout(tweetLoop, config.postTime)
}

await tweetLoop()