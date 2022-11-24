import {env} from "process";
import * as dotenv from 'dotenv'

dotenv.config()


export type Config = {
	/**
	 Bearer token generated from oauth.ts, used to actually post things to the account
	 */
	bearerToken: string,
	/**
	 * Client ID for the oauthv2 app, used to generate a bearer token in oauth.ts
	 */
	clientId: string,
	/**
	 * Client secret for the OAuthV2 app, used to generate a bearer token in oauth.ts
	 */
	clientSecret: string,
	/**
	 * How often takes should be posted, in milliseconds
	 */
	postTime: number,
	/**
	 * Suffix to add to the end of every tweet
	 */
	suffix: string,

	/**
	 * These are used for uploading media which needs the v1 api.
	 * This is a bit of a pain in the ass to use, but all the v1 data should just be copyable
	 * from the Developer Dashboard.
	 */
	v1ApiKey: string,
	v1ApiSecret: string,
	v1AccessToken: string,
	v1Secret: string,
	/**
	 * The user id of the account that's gonna post things.
	 * This is used to authorise access to uploaded media. Probably doing it wrong but this seemed to work.
	 */
	userId: string
}

const config: Config = {
	bearerToken: env['BEARER_TOKEN']!,
	clientId: env['CLIENT_ID']!,
	clientSecret: env['CLIENT_SECRET']!,
	postTime: parseInt(env['POST_TIME']!),
	suffix: env['SUFFIX']!,
	v1ApiKey: env['V1_API_KEY']!,
	v1ApiSecret: env['V1_API_SECRET']!,
	v1AccessToken: env['V1_ACCESS_TOKEN']!,
	v1Secret: env['V1_SECRET']!,
	userId: env['USER_ID']!
}

export default config