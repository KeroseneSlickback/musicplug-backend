const User = require('../models/user_model');
const { body, check, validationResult } = require('express-validator');

exports.register = (req, res) => {
	// Verify user data, create User, send confirmation if no errors
};

exports.login = (req, res) => {
	// verify user login data and sent JWT
};

exports.logout = (req, res) => {
	// remove user JWT by logout()
};

exports.logoutall = (req, res) => {
	// remove all user JWTs
};

exports.user_get = (req, res) => {
	// retrieve public user JSON data
};
