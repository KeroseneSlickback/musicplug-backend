const Post = require('../models/post_model');
const { body, check, validationResult } = require('express-validator');

exports.post_post = (req, res) => {
	// Create Post and save
};

exports.post_get_all = (req, res) => {
	// Retrive all posts
	// add conditionals
};

exports.post_get_single = (req, res) => {
	// Retrieve single post
	// Needed?
};

exports.post_patch = (req, res) => {
	// Update post
};

exports.post_delete = (req, res) => {
	// Delete post
};
