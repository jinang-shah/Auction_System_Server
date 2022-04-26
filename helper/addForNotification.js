function addForNotification(req, res, next) {
  console.log(req.user);
  console.log("doo");

  next();
}

module.exports = addForNotification;
