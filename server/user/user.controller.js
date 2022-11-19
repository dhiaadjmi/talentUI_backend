const User = require('./user.model');
const APIError = require('../helpers/APIError');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Get user
 * @returns {User}
 */
 function getOthersProfiles(req, res) {
  return res.json(User.find({'_id':req.body.user_id}));
}

/**
 * Create new test file
 * @property {string} req.body.avatar - The path image of fournisseur.
 * @returns {User}
 */
function images(req, res, next) {
  res.json(req.body.images)
}

/**
 * Create new test file
 * @property {string} req.body.avatar - The path image of fournisseur.
 * @returns {User}
 */
 function avatar(req, res, next) {
  res.json(req.body.avatar)
}




/**
 * Create new user
 * @property {string} req.body.userName
 * @property {string} req.body.email 
 * @property {string} req.body.password
 * @property {Object} req.body.talent
 * @property {String} req.body.role 
 * @property {String} req.body.avatar 
 * @property {String} req.body.desc 
 * @property {string} req.body.images - The path image of produit.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    talent: req.body.talent,
    role: req.body.role,
    avatar: 'http://localhost:8081//uploads/default.png',
    desc: "",
    images : []
  });

  user.save()
    .then(savedUser => { res.json(savedUser) })
    .catch(() => {
      const err = new APIError('User Error', 500, true)
      res.json(err)
    });

}

/**
 * Update existing user
 * @property {string} req.body.userName
 * @property {string} req.body.email 
 * @property {string} req.body.password
 * @property {String} req.body.avatar 
 * @property {String} req.body.desc 
 * @property {[string]} req.body.images 
 * @returns {User}
 */

function update(req, res, next) {
  const user = req.user;
  user.userName = req.body.userName;
  user.email = req.body.email;
  user.desc = req.body.desc;
  user.avatar = req.body.avatar;
  user.images = req.body.images;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  User.find().populate('posts').exec((err, users)=> {
    res.send(users)
  })
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

/**
 * @property {number} req.body.status
 * @property {number} req.body.id
 * @returns {User}
 */
 async function block(req, res, next) {
  let user = await User.findOne({ _id: req.body.id });
  user.blocked = req.body.status;
  user.save();
  res.send(user);
}

module.exports = { load, get, getOthersProfiles, create, update, list, remove, avatar, images, block };
