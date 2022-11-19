const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    //required: "UserName can't be empty",
  },
  email: {
    type: String,
    required: "Email can't be empty",
    unique: true,
  },
  password: {
    type: String,
    required: "Password can't be empty",
    minlength: [4, "Password must be atleast 4 character long"],
  },
  talent: {
    category: {
      type: String,
    },
    speciality: {
      type: String,
    },
  },
  role: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  avatar: {
    type: String,
  },
  images: {
    type: [String],
  },
  blocked: {
    type: Number,
    default: 0,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  saltSecret: String,
});
UserSchema.method({});

// Custom validation for email
UserSchema.path("email").validate((val) => {
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, "Invalid e-mail.");

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate("posts")
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError("No such user exists!", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model("User", UserSchema);
