<<<<<<< HEAD
=======

>>>>>>> development
const express = require("express");
const User = require("../../../model/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
<<<<<<< HEAD
=======
const auth = require("../middleware/auth_middleware");
const favourite = require("./favourite");

router.use(favourite);

// auto login
router.get("/login", auth, (req, res) => {
  console.log("authorizedddd");
  res.send(req.user);
});

>>>>>>> development

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
<<<<<<< HEAD
    console.log(user);
=======
>>>>>>> development
    if (!user) {
      return res.send("Invalid user");
    }
    const isValidPass = await bcrypt.compare(req.body.password, user.password);
<<<<<<< HEAD
    console.log("isValidPAss :", isValidPass);
    if (isValidPass) {
      const token = await user.generateAuthToken();
      res.status(200).send({ user, token });
    } else {
      res.send("Invalid email or password");
    }
  } catch (err) {
    res.send({ message: "Error while login", err });
  }
});
=======
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
>>>>>>> development

// register
router.post("/register", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
<<<<<<< HEAD
    res.status(201).send({ user, token });
    // const user = await User.create(req.body)
  } catch (error) {
    res.send({ message: "Error while registering user", err });
  }

  // .then((data)=>{
  //     console.log(data)
  //     const token =
  //     res.status(200).send(data)
  // }).catch((err)=>{
  //     res.status(404).send("error in creating user",err)
  // })
});

//update user details
router.patch("/edit/:id", async (req, res) => {
=======
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
>>>>>>> development
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

<<<<<<< HEAD
//fetch all users
router.get("/", async (req, res) => {
  await User.find()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.send({ message: "Error while fetching users", err });
    });
=======
// todo: add authmiddleware
router.get("/notifications", auth, async (req, res) => {
  const user = req.user;
  await user.populate("notifications.productId");
  res.status(200).send({ type: "success", data: user.notifications });
});

router.delete("/notification/:id", auth, (req, res) => {
  console.log(req.user);

  res.status(200).send({ msg: "Notification Deleted" });
>>>>>>> development
});

//fetch user by id
router.get("/:id", async (req, res) => {
  await User.findById(req.params.id)
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
<<<<<<< HEAD
      res.send({ message: "Error while getting user by id", err });
    });
});


=======
      res.status(404).send({ err: "error in getting user by id" });
    });
});
>>>>>>> development

module.exports = router;
