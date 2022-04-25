const express = require("express");
const router = express.Router();
const User = require("../../../model/user");

module.exports = router;

//fetch all users by admin

router.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    const data = user.map((d) => {
      return {
        name: d.name,
        email: d.email,
        mobile: d.mobile,
        status: d.isSeller,
      };
    });

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

//delete user by id
router.delete("/user/:id", async (req, res) => {
  try {
    console.log("delete id", req.params.id);
    const user = await User.findByIdAndDelete(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send("user deleted");
  } catch (e) {
    res.send(e);
  }
});
