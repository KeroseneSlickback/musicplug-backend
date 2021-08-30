const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		text: {
			type: String,
			required: true,
			trim: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Post',
		},
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
