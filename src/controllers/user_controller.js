const User = require('../models/user_model');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const sharp = require('sharp');
const utils = require('../lib/utils');

const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(
				new Error('Please upload as an image in jpg, jpeg, or png file.')
			);
		}
		cb(undefined, true);
	},
});

exports.register = [
	body('username', 'Username must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('email', 'Email must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('password', 'Password must not be empty.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('passwordConfirmation', 'Passwords must match')
		.exists()
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Password confirmation is incorrect');
			}
			return true;
		}),
	body('avatarLink', 'For profile picture').trim(),
	body('spotifyLink', 'Link for Spotify').trim().isLength({ min: 1 }),
	upload.single('avatar'),
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors);
		}
		const newUser = new User(req.body);
		if (req.file) {
			const buffer = await sharp(req.file.buffer)
				.resize({ width: 250, height: 250 })
				.png()
				.toBuffer();
			user.avatar = buffer;
		}
		console.log(req.body);
		try {
			const user = await newUser.save();
			const jwt = await utils.issueJWT(user);
			res.status(201).send({
				success: true,
				user,
				token: jwt.token,
				// expiresIn: jwt.expires,
			});
		} catch (e) {
			console.log(e);
			res.status(400).send(e);
		}
	},
];

exports.login = async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.username,
			req.body.password
		);
		if (!user) {
			res.status(401).json({ success: false, msg: 'Could not log in.' });
		}
		if (user) {
			const jwt = await utils.issueJWT(user);
			res.send({
				success: true,
				user,
				token: jwt.token,
				// expiresIn: jwt.expires,
			});
		} else {
			res.status(401).json({
				success: false,
				msg: 'You entered the wrong user infomation.',
			});
		}
	} catch (e) {
		res.status(400).send(e);
	}
};

// exports.logout = async (req, res) => {
// 	try {
// 		req.user.tokens = req.user.tokens.filter(token => {
// 			return token.token !== req.token;
// 		});
// 		await req.user.save();
// 		res.send();
// 	} catch (e) {
// 		res.status(500).send(e);
// 	}
// };

// exports.logoutall = async (req, res) => {
// 	try {
// 		req.user.tokens = [];
// 		await req.user.save();
// 		res.send();
// 	} catch (e) {
// 		res.status(500).send(e);
// 	}
// };

exports.user_get = async (req, res) => {
	const user = await User.findById(req.params.id);
	res.send(user.toJSON());
};
