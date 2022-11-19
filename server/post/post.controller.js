const Post = require("./post.model");
const User = require("../user/user.model");
const mongoose = require("mongoose");
const APIError = require("../helpers/APIError");

/**
 * Load Post and append to req.
 */
function load(req, res, next, id) {
  Post.get(id)
    .then((post) => {
      req.post = post; 
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Create new test file
 * @property {string} req.body.video 
 * @returns {Post}
 */
function video(req, res, next) {
  res.json(req.body.video);
}

/**
 * Get post
 * @returns {Post}
 */
async function get(req, res, next) {
  post = await Post.findOne({ _id: req.params.post_id })
    .populate([
      "user",
      {
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      },
    ])
    .exec((err, posts) => {
      res.send(posts);
    });
}

/**
 * Get post
 * @property {string} req.body.category
 * @returns {Post}
 */
async function filterByCategory(req, res, next) {
  let x = [];
  await Post.find()
    .populate([
      "user",
      {
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      },
    ])
    .exec((err, posts) => {
      x = posts;
    });
  x = x.sort(function (a, b) {
    let aCount = 0.0;
    a.comments.forEach((item) => {
      if(aCount==0)
      aCount = item.rate;
   else aCount=(aCount+item.rate)/2
    });

    let bCount = 0.0;
    b.comments.forEach((item) => {
      if(bCount==0)
      bCount = item.rate;
   else bCount=(bCount+item.rate)/2
    });
    return aCount > bCount ? -1 : 1;
  });
  res.send(
    x.filter((post) => {
      return post.user.talent.category === req.body.category;
    })
  );
}
/**
 * Get post
 * @property {string} req.body.speciality
 * @returns {Post}
 */
async function filterBySpeciality(req, res, next) {
  let x = [];
  await Post.find()
    .populate([
      "user",
      {
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      },
    ])
    .exec((err, posts) => {
      x = posts;
    });

    
  x = x.sort(function (a, b) {
    let aCount = 0.0;
    a.comments.forEach((item) => {
      if(aCount==0)
      aCount = item.rate;
   else aCount=(aCount+item.rate)/2
    });

    let bCount = 0.0;
    b.comments.forEach((item) => {
      if(bCount==0)
      bCount = item.rate;
   else bCount=(bCount+item.rate)/2
    });
    return aCount > bCount ? -1 : 1;
  });
  res.send(
    x.filter((post) => {
      return post.user.talent.speciality === req.body.speciality;
    })
  );
}
// /john/i

/**
 * Create new post
 * @property {string} req.body.desc - The username of util.
 * @property {string} req.body.video - The email of util.
 * @property {string} req.body.user_id - The username of util.
 * @returns {Post}
 */
async function create(req, res, next) {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    desc: req.body.desc,
    video: req.body.video,
    user: req.body.user_id,
    views: 0,
  });

  let user = await User.findById({ _id: req.body.user_id });

  User.update({ _id: user._id }, { $push: { posts: post._id } }).exec();
  user.save();

  post
    .save()
    .then((savedPost) => {
      res.json(savedPost);
    })
    .catch((err) => {
      // const err = new APIError('User Error', 500, true)
      // res.json(err)
      res.send(err);
    });
}

/**
 * @property {string} req.body.post_id
 * @returns {Post}
 */
async function updateViews(req, res, next) {
  let post = await Post.findOne({ _id: req.body.post_id }).populate([
    "user",
    {
      path: "comments",
      populate: {
        path: "user",
        model: "User",
      },
    },
  ]);
  post.views++;
  post.save();
  res.send(post);
}

/**
 * @property {number} req.body.status
 * @property {number} req.body.id
 * @returns {Post}
 */
async function report(req, res, next) {
  let post = await Post.findOne({ _id: req.body.id }).populate([
    "user",
    {
      path: "comments",
      populate: {
        path: "user",
        model: "User",
      },
    },
  ]);
  post.reported = req.body.status;
  post.save();
  res.send(post);
}

/**
 * Get post list.
 * @property {number} req.query.skip - Number of posts to be skipped.
 * @property {number} req.query.limit - Limit number of posts to be returned.
 * @returns {Post[]}
 */
function list(req, res, next) {
  Post.find()
    .populate([
      "user",
      {
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      },
    ])
    .exec((err, posts) => {
      let x = posts.sort(function (a, b) {
        let aCount = 0.0;
        a.comments.forEach((item) => {
          if(aCount==0)
          aCount = item.rate;
       else aCount=(aCount+item.rate)/2
        });

        let bCount = 0.0;
        b.comments.forEach((item) => {
          if(bCount==0)
          bCount = item.rate;
       else bCount=(bCount+item.rate)/2
        });
        return aCount > bCount ? -1 : 1;
      });
      res.json(x);
    });
}

/**
 * Delete Post.
 * @returns {Post}
 */
async function remove(req, res, next) {
  const post = await Post.findOne({ _id: req.params.post_id });
  post
    .remove()
    .then((deletedpost) => res.json(deletedpost))
    .catch((e) => next(e));
}

module.exports = {
  load,
  get,
  create,
  list,
  remove,
  video,
  updateViews,
  report,
  filterByCategory,
  filterBySpeciality,
};
