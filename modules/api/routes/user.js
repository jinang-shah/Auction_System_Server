const express = require("express");
const User = require("../../../model/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth_middleware");
const favourite = require("./favourite");

router.use(favourite);

// auto login
router.get("/login", auth, (req, res) => {
  console.log("authorizedddd");
  res.send(req.user);
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send("Invalid user");
    }
    const isValidPass = await bcrypt.compare(req.body.password, user.password);
    if (isValidPass) {
      const token = await user.generateAuthToken();
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(200).send({ user });
    } else {
      res.send({ err: "Invalid email or password" });
    }
  } catch (err) {
    console.log("Error while login", err);
    res.send({ message: "Error while login", err });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send({
    msg: "loggedout",
  });
});

// register
router.post("/register", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(201).send({ user });
    // const user = await User.create(req.body)
  } catch (error) {
    res.status(404).send({ msg: "error in create user", error });
  }
});

//update user details
router.patch("/edit/:id", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((data) => {
      console.log(data);
      res.status(202).send(data);
    })
    .catch((err) => {
      console.log("error while updating user details", err);
      res.status(404).send("error while updating user details");
    });
});

// todo: add authmiddleware
router.get("/notifications", auth, async (req, res) => {
  const user = req.user;
  await user.populate("notifications.productId");
  res.status(200).send({ type: "success", data: user.notifications });
});

router.delete("/notification/:id", auth, (req, res) => {
  console.log(req.user);

  res.status(200).send({ msg: "Notification Deleted" });
});

//fetch user by id
router.get("/:id", async (req, res) => {
  await User.findById(req.params.id)
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404).send({ err: "error in getting user by id" });
    });
});

module.exports = router;
