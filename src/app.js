// Required dependencies
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
require('./db/mongoose');
require('dotenv').config();
require('./config/passport')(passport);

// Spotify testing
const querystring = require('querystring');
const request = require('request');

// Required components

// Required variables

const PORT = process.env.PORT || 8888;

// Required routes
const user_router = require('./routers/user_router');
const post_router = require('./routers/post_router');

// Global middleware
const app = express();

app.use(passport.initialize());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// Required middleware routes
app.use('/users', user_router);
app.use('/posts', post_router);

// Spotify testing

const response_type = 'code';
const SPOTIFY_AUTHORIZE_ENDPOINT = 'https://accounts.spotify.com/authorize?';
const redirect_uri = 'http://localhost:8888/callback';
const SPACE_DELIMITER = '%20';
const SCOPES = ['user-read-private', 'user-read-email'];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

app.get('/login', (req, res) => {
	res.redirect(
		SPOTIFY_AUTHORIZE_ENDPOINT +
			querystring.stringify({
				client_id: process.env.SPOTIFY_CLIENT_ID,
				redirect_uri,
				scope: SCOPES_URL_PARAM,
				response_type,
				show_dialog: true,
			})
	);
});

app.get('/callback', (req, res) => {
	const code = req.query.code || null;

	const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri,
			grant_type: 'authorization_code',
		},
		headers: {
			Authorization:
				'Basic ' +
				new Buffer(
					process.env.SPOTIFY_CLIENT_ID +
						':' +
						process.env.SPOTIFY_CLIENT_SECRET
				).toString('base64'),
		},
		json: true,
	};

	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			const access_token = body.access_token,
				refresh_token = body.refresh_token;

			const options = {
				url: 'https://api.spotify.com/v1/me',
				headers: { Authorization: 'Bearer ' + access_token },
				json: true,
			};

			// request.get(options, function (error, response, body) {
			// 	console.log(body);
			// });

			console.log(access_token);
			res.redirect(
				'http://localhost:3000/redirect/#' +
					querystring.stringify({
						access_token,
						refresh_token,
					})
			);
		} else {
			res.redirect(
				'http://localhost:3000/redirect/#' +
					querystring.stringify({
						error: 'invalid_token',
					})
			);
		}
	});
});

app.get('/refresh_token', function (req, res) {
	const refresh_token = req.query.refresh_token;
	const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {
			Authorization:
				'Basic ' +
				new Buffer(
					process.env.SPOTIFY_CLIENT_ID +
						':' +
						process.env.SPOTIFY_CLIENT_SECRET
				).toString('base64'),
		},
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token,
		},
		json: true,
	};

	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			const access_token = body.access_token;
			res.send({
				access_token,
			});
		}
	});
});

app.get('*', (req, res) => {
	res.status(404).json({ message: 'Resource not found' });
});

// Catch 404
app.use(function (req, res, next) {
	next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	// JSON error-handling?
});

// Listen
app.listen(PORT, () =>
	console.log(`Backend of MusicPlug is listening on port ${PORT}`)
);
