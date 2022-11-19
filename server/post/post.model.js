const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');


/**
 * Post Schema
 */
const PostSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    views: {
        type: Number
    },
    reported: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: String,
        default: new Date().toISOString().substr(0, 10)
    }


});

PostSchema.method({
});

/**
 * Statics
 */
PostSchema.statics = {
    /**
     * Get post
     * @param {ObjectId} id - The objectId of post.
     * @returns {Promise<Post, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((post) => {
                if (post) {
                    return post;
                }
                const err = new APIError('No such post exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List posts in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of posts to be skipped.
     * @param {number} limit - Limit number of posts to be returned.
     * @returns {Promise<Post[]>}
     */
    list() {
        return this.find()
            // .sort({ createdAt: -1 })
            .exec();
    }
};
/**
 * @typedef Post
 */
module.exports = mongoose.model('Post', PostSchema);
