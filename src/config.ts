import { env } from "node:process";

export type Config = {
	/**
	 * App key from Twitter developer portal
	 */
	consumerKey: string;
	/**
	 * App secret from Twitter developer portal
	 */
	consumerSecret: string;

	/**
	 * User token, generated with something like twurl
	 */
	token: string;
	/**
	 * User secret, generated with something like twurl
	 */
	secret: string;
	/**
	 * How often takes should be posted, in milliseconds
	 */
	postTime: number;
	/**
	 * Suffix to add to the end of every tweet
	 */
	suffix: string;
};

const config: Config = {
	consumerKey: env.CONSUMER_KEY ?? "invalid consumer key",
	consumerSecret: env.CONSUMER_SECRET ?? "invalid consumer secret",
	token: env.TOKEN ?? "invalid token",
	secret: env.SECRET ?? "invalid secret",
	postTime: parseInt(env.POST_TIME ?? "0", 10),
	suffix: env.SUFFIX ?? "invalid suffix",
};

export default config;
