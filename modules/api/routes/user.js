const express = require("express");
const User = require("../../../model/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth_middleware");

// auto login
router.get("/login", auth, (req, res) => {
  console.log("authorizedddd");
  console.log(req.user);
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

//fetch all users
router.get("/", auth, async (req, res) => {
  await User.find()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.send({ message: "error in fetching user", err });
    });
});

//fetch user by id
router.get("/:id", auth, async (req, res) => {
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
