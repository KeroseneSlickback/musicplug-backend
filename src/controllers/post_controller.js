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

	if (req.query.sortby) {
		const parts = req.query.sortby.split('_');
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
	}

	try {
		Post.find()
			.populate({
				path: 'comments',
				populate: { path: 'owner' },
			})
			.populate('likedUsers')
			.populate('owner')
			.skip(pageOptions.page * pageOptions.limit)
			.limit(pageOptions.limit)
			.sort(sort)
			.exec(function (err, posts) {
				if (err) throw new Error();
				res.send(posts);
			});
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.post_count_get = async (req, res) => {
	try {
		Post.find().countDocuments(function (err, count) {
			if (err) throw new Error();
			res.send({ count });
		});
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.post_count_genre_get = async (req, res) => {
	const genre = req.query.genre;
	try {
		Post.find({ genre }).countDocuments(function (err, count) {
			if (err) throw new Error();
			res.send({ count });
		});
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.post_get_single = async (req, res) => {
	const _id = req.params.id;
	try {
		Post.findOne({ _id })
			.populate({
				path: 'comments',
				populate: { path: 'owner' },
			})
			.populate('owner')
			.populate('likedUsers')
			.exec(function (err, post) {
				if (err) throw new Error();
				res.status(200).send(post);
			});
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.post_get_genre = async (req, res) => {
	const pageOptions = {
		limit: parseInt(req.query.limit, 10) || 10,
		page: parseInt(req.query.page, 10) || 0,
	};

	const genre = req.query.genre;

	const sort = {};

	if (req.query.sortby) {
		const parts = req.query.sortby.split('_');
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
	}

	try {
		Post.find({ genre })
			.populate({
				path: 'comments',
				populate: { path: 'owner' },
			})
			.populate('owner')
			.populate('likedUsers')
			.skip(pageOptions.page * pageOptions.limit)
			.limit(pageOptions.limit)
			.sort(sort)
			.exec(function (err, posts) {
				if (err) throw new Error();
				res.send(posts);
			});
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.post_patch = async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['title', 'body'];
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

exports.post_patch_like = async (req, res) => {
	try {
		const post = await Post.findOne({
			_id: req.params.id,
		});
		if (!post) {
			return res.status(404).send();
		}
		const foundUserIndex = post.likedUsers.indexOf(req.user._id);
		if (foundUserIndex >= 0) {
			return res.status(403).send();
		} else {
			post.votes = post.votes + 1;
			post.likedUsers.push(req.user);
			await post.save();
			res.send(post);
		}
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.post_patch_unlike = async (req, res) => {
	try {
		const post = await Post.findOne({
			_id: req.params.id,
		});
		if (!post) {
			return res.status(404).send();
		}
		const foundUserIndex = post.likedUsers.indexOf(req.user._id);
		if (foundUserIndex >= 0) {
			post.votes = post.votes - 1;
			post.likedUsers.pull(req.user);
			await post.save();
			res.send(post);
		} else {
			return res.status(404).send();
		}
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
