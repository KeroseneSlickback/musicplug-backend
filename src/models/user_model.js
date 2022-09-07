const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Post = require("./post_model");
const Comment = require("./comment_model");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (value.length < 6) {
          throw new Error("Password must be greater than 6 characters");
        }
        if (value.includes("password")) {
          throw new Error('Password must not contain the word "password".');
        }
      },
    },
    avatar: {
      type: Buffer,
    },
    spotifyLink: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
    },
    admin: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.email;
  delete userObject.admin;
  delete userObject.emailVerified;
  // delete userObject.spotifyLink;

  return userObject;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Post.deleteMany({ owner: user._id });
  await Comment.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
