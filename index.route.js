const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const commentRoutes = require('./server/comments/comment.route');
const postRoutes = require('./server/post/post.route');

const router = express.Router(); // eslint-disable-line new-cap
const jwtHelper = require('./config/jwtHelper');


// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

router.use('/comments', commentRoutes);

router.use('/posts', postRoutes);


module.exports = router;
