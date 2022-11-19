const express = require('express');
const postCtrl = require('./post.controller');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get(postCtrl.list)
    .put(postCtrl.updateViews)
    .post(postCtrl.create);

router.route('/report')
    .put(postCtrl.report)

router.route('/filter_posts')
    .post(postCtrl.filterByCategory)

router.route('/filter_posts_by_speciality')
    .post(postCtrl.filterBySpeciality)

router.route('/uploadVideo')
    .post(upload.single('video'), (req, res, next) => {
        req.body.video = req.file.path;
        postCtrl.video(req, res, next)
    })

router.route('/:post_id')
    .get(postCtrl.get)
    .delete(postCtrl.remove);

module.exports = router;
