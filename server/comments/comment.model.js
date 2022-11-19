const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');


/**
 * Comment Schema
 */
const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    createdAt: {
        type: String,
        default: new Date().toISOString().substr(0, 10)
    }
});

CommentSchema.method({
});

/**
 * Statics
 */
 CommentSchema.statics = {
    /**
     * Get comment
     * @param {ObjectId} id - The objectId of comment.
     * @returns {Promise<Comment, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((comment) => {
                if (comment) {
                    return comment;
                }
                const err = new APIError('No such comment exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List comments in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of comments to be skipped.
     * @param {number} limit - Limit number of comments to be returned.
     * @returns {Promise<Comment[]>}
     */
    list() {
        return this.find()
            .exec();
    }
};
/**
 * @typedef Comment
 */
module.exports = mongoose.model('Comment', CommentSchema);
