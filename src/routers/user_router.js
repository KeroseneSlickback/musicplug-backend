const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

// Controllers
const user_controller = require('../controllers/user_controller');
const me_controller = require('../controllers/me_controller');

// User POST
router.post('/register', user_controller.register);

router.post('/login', user_controller.login);

router.post('/logout', auth, user_controller.logout);

// Logout of all user jwt-sessions
router.post('/logoutall', auth, user_controller.logoutall);

// User GET
router.get('/:id/info', auth, user_controller.user_get);

// Me POST
// After initial account creation, everything for /me/ is updates

// Me GET
router.get('/me', auth, me_controller.get_me);

// Me PATCH
router.patch('/me', auth, me_controller.patch_me);

// PATCH for email verification

// Me DELETE
router.delete('/me/', auth, me_controller.delete_me);

module.exports = router;
