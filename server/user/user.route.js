const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const userCtrl = require('./user.controller');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(userCtrl.list)
  .post(userCtrl.create);

router.route('/block')
  .put(userCtrl.block)


router.route('/images')
  .post(upload.single('images'), (req, res, next) => {
    // res.json(req.file.path)
    req.body.images = req.file.path
    userCtrl.images(req, res, next)
  })

router.route('/:userId')
  .get(userCtrl.get)
  .put( userCtrl.update)
  .post(upload.single('avatar'), (req, res, next) => {
    res.json(req.file.path)
    userCtrl.avatar(req, res, next)
  })
  .delete(userCtrl.remove);
router.param('userId', userCtrl.load);

module.exports = router;
