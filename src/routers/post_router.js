const express = require('express');
const router = express.Router();

// Controllers
const post_controller = require('../controllers/post_controller');
const comment_controller = require('../controllers/comment_controller');

// Post POST
router.post('/', post_controller.post_post);

// Post GET
router.get('/', post_controller.post_get_all);

router.get('/:id', post_controller.post_get_single);

// Post PATCH
router.patch('/:id', post_controller.post_patch);

// Post DELETE
router.delete('/:id', post_controller.post_delete);

// Comments below

// comment POST
router.post('/:id/comments', comment_controller.comment_post);

// comment GET
router.get('/:id/comments', comment_controller.comment_get_all);

router.get('/:id/comments/:id', comment_controller.comment_get_single);

// comment PATCH
router.patch('/:id/comments/:id', comment_controller.comment_patch);

// comment DELETE
router.delete('/:id/comments/:id', comment_controller.comment_delete);
