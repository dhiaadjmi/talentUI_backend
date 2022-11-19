const jwt = require("jsonwebtoken");
const User = require("../user/user.model");
// const passport = require('passport');
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email  doesn't exists");

  if (req.body.password == user.password) {
    if (user.blocked === 0) {
      const token = jwt.sign({ _id: user._id }, "qsd");
      response = {
        token: token,
        user: user,
      };
      res.status(200).json(response);
      console.log(" connected  :", user.nom);
    } else {
      res.status(400).json("Vous etes blocké");
    }
  } else {
    res.status(400).json("Invalide password");
  }
}

function me(req, res, next) {
  var token = req.headers["x-access-token"];
  jwt.verify(token, "qsd", function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    res.status(200).send({ id: decoded._id });
  });
}

module.exports = { login, me };
