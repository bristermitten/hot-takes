import {auth} from "twitter-api-sdk";
import express from "express";
import config from './config.js'


const app = express();

const authClient = new auth.OAuth2User({
	client_id: config.clientId as string,
	client_secret: config.clientSecret as string,
	callback: "http://127.0.0.1:3000/callback",
	scopes: ["tweet.read", "tweet.write", "users.read"],
});

const STATE = "my-state";

app.get("/callback", async function (req, res) {
	try {
		const {code, state} = req.query;
		if (state !== STATE) return res.status(500).send("State isn't matching");
		const token = await authClient.requestAccessToken(code as string);
		console.log(token)

	} catch (error) {
		console.log(error);
	}
});

app.get("/login", async function (req, res) {
	const authUrl = authClient.generateAuthURL({
		state: STATE,
		code_challenge_method: "s256",
	});
	res.redirect(authUrl);
});


app.get("/revoke", async function (req, res) {
	try {
		const response = await authClient.revokeAccessToken();
		res.send(response);
	} catch (error) {
		console.log(error);
	}
});


app.listen(3000, () => {
	console.log(`Go here to login: http://127.0.0.1:3000/login`);
});