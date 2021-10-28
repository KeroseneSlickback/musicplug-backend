const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		body: {
			type: String,
			required: true,
			trim: true,
		},
		genre: {
			type: String,
			trim: true,
			lowercase: true,
		},
		votes: {
			type: Number,
			default: 0,
		},
		recommendation: {
			artistName: { type: String },
			artistId: { type: String },
			artistImgUrl: { type: String },
			artistUrl: { type: String },
			albumName: { type: String },
			albumId: { type: String },
			albumImgUrl: { type: String },
			albumUrl: { type: String },
			trackName: { type: String },
			trackId: { type: String },
			trackImgUrl: { type: String },
			trackUrl: { type: String },
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
		likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	{
		timestamps: true,
	}
);

// postSchema.virtual('comments', {
// 	ref: 'Comment',
// 	localField: '_id',
// 	foreignField: 'post',
// });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
