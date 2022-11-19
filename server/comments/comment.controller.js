const Comment = require('./comment.model');
const Post = require('../post/post.model')
const mongoose = require('mongoose');
const APIError = require('../helpers/APIError');

/**
 * Load Comment and append to req.
 */
function load(req, res, next, id) {
  Comment.get(id)
    .then((comment) => {
      req.comment = comment; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}



/**
 * Create new comment
 * @property {string} req.body.text - The username of util.
 * @property {Number} req.body.rate - The email of util.
 * @property {string} req.body.user_id- The password of util.
 * @property {string} req.body.post_id - The username of util.
 * @returns {Comment}
 */
async function create(req, res, next) {
  const comment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    text: req.body.text,
    rate: req.body.rate,
    user : req.body.user_id,
    post : req.body.post_id,
  });
  
  let post =  await Post.findById({ _id: req.body.post_id })
  
  Post.update(
    { _id: post._id },
    { $push: { comments: comment._id } }
  ).exec()
  post.save()
  comment.populate('user').execPopulate()
  comment.save()
    .then(savedComment => {res.json(savedComment)})
    .catch((err) => {
        res.send(err)
    });

}

/**
 * Get comment list.
 * @property {number} req.query.skip - Number of posts to be skipped.
 * @property {number} req.query.limit - Limit number of posts to be returned.
 * @returns {Comment[]}
 */
function list(req, res, next) {
  Comment.find().populate(['user', 'post']).exec((err, comments)=> {
    res.send(comments)
  })
    // .then(posts => res.json(posts))
    // .catch(e => next(e));
}

module.exports = { load, create, list};
