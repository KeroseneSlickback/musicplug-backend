const Post = require('../models/post_model');
const Comment = require('../models/comment_model');

exports.get_me = (req, res) => {
	res.send(req.user);
};

exports.patch_me = [
	async (req, res) => {
		const updates = Object.keys(req.body);
		const allowedUpdates = ['username', 'password', 'avatar'];
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
			await req.user.save();
			await res.send(req.user);
		} catch (e) {
			console.log(e);
			res.status(400).send(e);
		}
	},
];

exports.delete_me = async (req, res) => {
	try {
		await Post.deleteMany({ owner: req.user._id });
		await Comment.deleteMany({ owner: req.user._id });
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		req.status(500).send();
	}
};
