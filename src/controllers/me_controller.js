const User = require('../models/user_model');
const multer = require('multer');
const sharp = require('sharp');

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

exports.get_me = (req, res) => {
	res.send(req.user);
};

exports.patch_me = [
	upload.single('avatar'),
	async (req, res) => {
		const updates = Object.keys(req.body);
		const allowedUpdates = ['username', 'email', 'password', 'avatar'];
		const isValidOperation = updates.every(update => {
			return allowedUpdates.includes(update);
		});

		if (!isValidOperation) {
			return res.status(400).send({ error: 'Invalid updates!' });
		}

		try {
			updates.forEach(update => {
				req.user[update] = req.body[update];
			});
			if (req.file) {
				const buffer = await sharp(req.file.buffer)
					.resize({ width: 250, height: 250 })
					.png()
					.toBuffer();
				user.avatar = buffer;
			}
			await req.user.save();
			res.send(req.user);
		} catch (e) {
			res.status(400).send(e);
		}
	},
];

exports.delete_me = async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		req.status(500).send();
	}
};
