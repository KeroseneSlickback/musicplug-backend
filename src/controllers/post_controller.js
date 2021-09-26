const Post = require('../models/post_model');
const Comment = require('../models/comment_model');

exports.post_post = async (req, res) => {
	// find user details, perhaps include that infomation in request from front-end
	const post = new Post({
		...req.body,
		owner: req.user._id,
	});

	try {
		await post.save();
		res.status(201).send(post);
	} catch (e) {
		res.status(400).send(e);
	}
};
//  ?limit=10
//  ?page=3
//  ?sortBy=createdAt_asc/desc
exports.post_get = async (req, res) => {
	const pageOptions = {
		limit: parseInt(req.query.limit, 10) || 10,
		page: parseInt(req.query.page, 10) || 0,
	};
	const sort = {};

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split('_');
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
	}
	try {
		Post.find()
			.populate({
				path: 'comments',
				populate: { path: 'owner' },
			})
			.populate('owner')
			.skip(pageOptions.page * pageOptions.limit)
			.limit(pageOptions.limit)
			.sort(sort)
			.exec(function (err, posts) {
				if (err) throw new Error();
				res.send(posts);
			});
		// res.send(foundPosts);
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.post_get_single = async (req, res) => {
	const _id = req.params.id;
	try {
		Post.findOne({ _id })
			.populate('comments')
			.populate('owner')
			.exec(function (err, post) {
				if (err) throw new Error();
				res.status(200).send(post);
			});
		// if (!post) {
		// 	return res.status(404).send();
		// }
		// res.status(200).send(post);
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.post_patch = async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['title', 'text'];
	const isValidOperation = updates.every(update => {
		return allowedUpdates.includes(update);
	});
	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}
	try {
		const post = await Post.findOne({
			_id: req.params.id,
			owner: req.user._id,
		});
		if (!post) {
			return res.status(404).send();
		}
		updates.forEach(update => {
			post[update] = req.body[update];
		});
		await post.save();
		res.send(post);
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.post_delete = async (req, res) => {
	try {
		const post = await Post.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id,
		});
		if (!post) {
			return res.status(404).send();
		}
		await Comment.deleteMany({ post: req.params.id });

		res.status(200).send();
	} catch (e) {
		res.status(500).send();
	}
};
