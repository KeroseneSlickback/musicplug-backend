const Comment = require('../models/comment_model');
const Post = require('../models/post_model');

exports.comment_post = async (req, res) => {
	const comment = new Comment({
		...req.body,
		owner: req.user._id,
		post: req.params.id,
	});
	const postRelated = await Post.findById(req.params.id);
	postRelated.comments.push(comment._id);
	try {
		await comment.save();
		await postRelated.save();
		res.status(201).send(comment);
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.comment_patch = async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['body'];
	const isValidOperation = updates.every(update => {
		return allowedUpdates.includes(update);
	});
	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalide updates' });
	}
	console.log(req.params.id, req.params.otherId);
	try {
		const comment = await Comment.findOne({
			_id: req.params.otherId,
			owner: req.user._id,
		});
		if (!comment) {
			return res.status(404).send();
		}
		updates.forEach(update => {
			comment[update] = req.body[update];
		});
		await comment.save();
		res.send(comment);
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.comment_delete = async (req, res) => {
	try {
		const comment = await Comment.findOneAndDelete({
			_id: req.params.otherId,
			owner: req.user._id,
		});
		if (!comment) {
			return res.status(404).send();
		} else {
			res.status(200).send();
		}
	} catch (e) {
		res.status(500).send();
	}
};
