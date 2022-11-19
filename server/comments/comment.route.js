const express = require('express');
const commentCtrl = require('./comment.controller');
// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });
// const upload = multer({ storage: storage });

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get(commentCtrl.list)
    .post(commentCtrl.create);

// router.route('/uploadVideo')
//     .post(upload.single('avatar'), (req, res, next) => {
//         req.body.avatar = req.file.avatar;
//         postCtrl.images(req, res, next)
//     })

// router.route('/:postId')
//     .delete(postCtrl.remove);
// router.param('userId', postCtrl.load);  

module.exports = router;
