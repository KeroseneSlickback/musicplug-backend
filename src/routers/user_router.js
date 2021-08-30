const express = require('express');
const router = express.Router();

// Controllers
const user_controller = require('../controllers/user_controller');
const me_controller = require('../controllers/me_controller');

// User POST
router.post('/register', user_controller.register);

router.post('/login', user_controller.login);

router.post('/logout', user_controller.logout);

router.post('/logoutall', user_controller.logoutall);

// User GET
router.get('/:id/info', user_controller.user_get);

// Me POST
// After initial account creation, everything for /me/ is updates

// Me GET
router.get('/me', me_controller.get_me);

// Me PATCH
router.patch('/me', me_controller.patch_me);

// Me DELETE
router.delete('/me/', me_controller.delete_me);
