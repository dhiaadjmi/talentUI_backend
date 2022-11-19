const express = require('express');
const authCtrl = require('./auth.controller');

const jwt = require('jsonwebtoken');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(authCtrl.login);

  router.route('/me').get(authCtrl.me);
// router.get('/me', (req, res, next) => {

 
// });


router.get('/logout', async (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;