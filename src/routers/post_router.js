const express = require('express');
const router = new express.Router();
const passport = require('passport');

// Controllers
const post_controller = require('../controllers/post_controller');
const comment_controller = require('../controllers/comment_controller');

// Post POST
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	post_controller.post_post
);

// Post GET
router.get('/', post_controller.post_get);

router.get('/genre', post_controller.post_get_genre);

router.get('/:id', post_controller.post_get_single);

// Post PATCH
router.patch(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	post_controller.post_patch
);

router.patch(
	'/like/:id',
	passport.authenticate('jwt', { session: false }),
	post_controller.post_patch_like
);

router.patch(
	'/unlike/:id',
	passport.authenticate('jwt', { session: false }),
	post_controller.post_patch_unlike
);

// Post DELETE
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	post_controller.post_delete
);

// Comments below

// comment POST
router.post(
	'/:id/comments',
	passport.authenticate('jwt', { session: false }),
	comment_controller.comment_post
);

// comment GET
// Not needed as there's no reason to directly search for comments, reserved for Posts or Users
// router.get('/:id/comments', comment_controller.comment_get_all);

// router.get('/:id/comments/:id', comment_controller.comment_get_single);

// comment PATCH
router.patch(
	'/:id/comments/:otherId',
	passport.authenticate('jwt', { session: false }),
	comment_controller.comment_patch
);

// comment DELETE
router.delete(
	'/:id/comments/:otherId',
	passport.authenticate('jwt', { session: false }),
	comment_controller.comment_delete
);

module.exports = router;
