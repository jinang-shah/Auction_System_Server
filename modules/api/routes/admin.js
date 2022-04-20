const express = require("express");
const router = express.Router();
const User = require("../../../model/user");

// get all users (admin-manage-users)
router.get("/users", async (req, res) => {
  await User.find()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.send("error in fetching user", err);
    });
});

module.exports = router;
