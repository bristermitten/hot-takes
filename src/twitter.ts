import { TwitterApi } from "twitter-api-v2";
import config from "./config.js";

export const twitterAPI = new TwitterApi({
	appKey: config.consumerKey,
	appSecret: config.consumerSecret,
	accessToken: config.token,
	accessSecret: config.secret,
});
