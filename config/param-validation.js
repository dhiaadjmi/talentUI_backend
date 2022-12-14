const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      userName: Joi.string().required(),
      email: Joi.string().required(),
      password:Joi.string().required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      userName: Joi.string().required(),
      email: Joi.string().required(),
      password:Joi.string().required(),
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },




  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
