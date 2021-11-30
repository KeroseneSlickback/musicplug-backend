const express = require('express');
const router = new express.Router();

const spotify_controller = require('../controllers/spotify_controller');

router.get('/login', spotify_controller.login);

router.get('/callback', spotify_controller.callback);

router.get('/refresh_token', spotify_controller.refresh_token);

module.exports = router;
