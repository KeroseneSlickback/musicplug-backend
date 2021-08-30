const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
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
		artist: {
			type: String,
			trim: true,
		},
		bio: {
			type: String,
			trim: true,
		},
		genre: {
			type: String,
			trim: true,
		},
		image: {
			type: Buffer,
		},
		votes: {
			type: Number,
		},
		recommended: {
			type: String,
			trim: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

postSchema.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'post',
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
