const User = require('../models/user_model');
const { body, check, validationResult } = require('express-validator');

exports.get_me = (req, res) => {
	// Retrive personal infomation
};

exports.patch_me = (req, res) => {
	// Update user info, following the same /users/register standard
};

exports.delete_me = (req, res) => {
	// remove User and all associated posts and comments
};
