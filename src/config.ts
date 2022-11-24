import {env} from "process";
import * as dotenv from 'dotenv'

dotenv.config()


export type Config = {
	/**
	 * App key from Twitter developer portal
	 */
	consumerKey: string,
	/**
	 * App secret from Twitter developer portal
	 */
	consumerSecret: string,

	/**
	 * User token, generated with something like twurl
	 */
	token: string,
	/**
	 * User secret, generated with something like twurl
	 */
	secret: string,
	/**
	 * How often takes should be posted, in milliseconds
	 */
	postTime: number,
	/**
	 * Suffix to add to the end of every tweet
	 */
	suffix: string,
}

const config: Config = {
	consumerKey: env['CONSUMER_KEY']!,
	consumerSecret: env['CONSUMER_SECRET']!,
	token: env['TOKEN']!,
	secret: env['SECRET']!,
	postTime: parseInt(env['POST_TIME']!),
	suffix: env['SUFFIX']!,
}

export default config