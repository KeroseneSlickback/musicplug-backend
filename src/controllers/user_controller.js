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
	upload.single('avatar'),
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render('error');
		}
		const newUser = new User(req.body);
		if (req.file) {
			const buffer = await sharp(req.file.buffer)
				.resize({ width: 250, height: 250 })
				.png()
				.toBuffer();
			user.avatar = buffer;
		}
		try {
			newUser.save().then(user => {
				const jwt = utils.issueJWT(user);
				res
					.status(201)
					.send({ user, token: jwt.token, expiresIn: jwt.expires });
			});
			// res.status(201).send({ user, token });
		} catch (e) {
			res.status(400).send(e);
		}
	},
];

exports.login = async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.logout = async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(token => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.logoutall = async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.user_get = async (req, res) => {
	const user = await User.findById(req.params.id);
	res.send(user.toJSON());
};
