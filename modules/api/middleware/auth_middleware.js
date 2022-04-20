const User = require("../../../model/user");

async function auth(req, res, next) {
  req.user = await User.findById("625d6cfc26a5625303bf54dc");
  next();
}

module.exports = auth;
