const express = require("express");
const router = new express.Router();
const multer = require("multer");
const passport = require("passport");

// Controllers
const user_controller = require("../controllers/user_controller");
const me_controller = require("../controllers/me_controller");

// Middleware
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

// User POST
router.post("/register", user_controller.register);

router.post("/login", user_controller.login);

// With passport-jwt, no need for logout sessions as the token is save in user's local storage. Logout would then be initiated from the front-end to delete that stored token earlier.

// User GET
router.get(
  "/:id/info",
  passport.authenticate("jwt", { session: false }),
  user_controller.user_get
);

// Me POST
// After initial account creation, everything for /me/ is updates

// Me GET
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  me_controller.get_me
);

// Me PATCH
router.patch(
  "/me",
  passport.authenticate("jwt", { session: false }),
  me_controller.patch_me
);

// Me DELETE
router.delete(
  "/me/",
  passport.authenticate("jwt", { session: false }),
  me_controller.delete_me
);

// Me Avatar upload
router.patch(
  "/me/avatar",
  passport.authenticate("jwt", { session: false }),
  upload.single("picture"),
  me_controller.avatar_me
);

module.exports = router;
