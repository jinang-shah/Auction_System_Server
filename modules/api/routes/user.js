const express = require("express");
const User = require("../../../model/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmails");
const crypto = require("crypto");
const auth = require("../middleware/auth_middleware");
const gethistory = require("../../../helper/gethistory");
const multer = require("multer");
const favourite = require("./favourite");

router.use(favourite);

//change password
router.post("/change-password/:id", auth, async (req, res) => {
  const passwordDetails = req.body;
  const user = req.user;
  console.log(user);
  console.log(passwordDetails);
  const isValidPass = await bcrypt.compare(
    passwordDetails.oldPassword,
    user.password
  );
  console.log(isValidPass);
  if (isValidPass) {
    user.password = await bcrypt.hash(passwordDetails.newPassword, 8);

    await user.save();
    res.status(200).send();
    console.log("Password change sucessfully");
  } else {
  }
});

//reset password

router.post("/reset-password/:resetToken", async (req, res, next) => {
  try {
    console.log(req.params.resetToken);
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new Error("Invalid reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    //console.log(user)
    await user.save();

    res.status(201).json({
      success: true,
      data: "password reset success",
    });
  } catch (error) {
    next(error);
  }
});

//forgot password
router.post("/forgot-password", async (req, res, next) => {
  const { email } = req.body;
  console.log({ email });

  try {
    const user = await User.findOne({ email });
    // console.log(user);

    if (!user) {
      return next(new Error("Email could not be sent, no user", 404));
    }

    const resetToken = user.getResetPasswordToken();
    console.log(resetToken);
    await user.save();

    const resetUrl = `http://localhost:4200/#/reset-password/${resetToken}`;

    const message = `
        <h1>You have requested a password reset</h1>
        <p>please go to this link to reset your password</p>
        <a href = ${resetUrl} clicktracking=off>${resetUrl}</a>
      `;

    try {
      await sendEmail({
        to: user.email,
        subject: "password reset request",
        text: message,
      });
      res.status(200).json(resetToken);
    } catch (error) {
      user.resetpasswordToken = undefined;
      user.resetpasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent !", 500));
    }
  } catch (error) {
    next(error);
  }
});

// seller verification
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "documents/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

router.post(
  "/sellerverification",
  auth,
  upload.fields([
    { name: "pancard", maxCount: 1 },
    { name: "elecard", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      user.documents.pancard = req.files.pancard.map((x) => x.path).toString();
      user.documents.elecard = req.files.elecard.map((x) => x.path).toString();

      await user.save();
      res.send({ msg: "Documents Uploaded" });
    } catch (error) {
      res.status(404).send({ msg: "error in uploading Documents", error });
    }
  }
);

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

// auto login
router.get("/login", auth, (req, res) => {
  console.log("authorizedddd");
  res.send(req.user);
});

//login
router.post("/login", async (req, res) => {
  console.log("login api", req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({ message: "user not found", isValid: false });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user.password);
    if (isValidPass) {
      const token = await user.generateAuthToken();
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(200).send({ message: "valid", user, isValid: true });
    } else {
      res.send({ message: "Invalid email or password", isValid: false });
    }
  } catch (err) {
    console.log("Error while login", err);
    res.send({ message: "Error while login", isValid: false });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send({
    msg: "loggedout",
  });
});

// register
router.post("/register", upload.single("aadharcard"), async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    const user = new User(req.body);
    user.documents.aadharcard = req.file.path;
    await user.save();
    const token = await user.generateAuthToken();
  res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).send({ message: "user registered", user, isRegistered: true });
        // const user = await User.create(req.body)
    } catch (error) {
        console.log(error);
        res.send({ message: "Error while registering", isRegistered: false });
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

// fetch user buying history
router.get(
  "/buyinghistory",
  auth,
  (req, res, next) => {
    req.historyType = "buyHistory";
    next();
  },
  gethistory
);

// fetch user selling history
router.get(
  "/sellinghistory",
  auth,
  (req, res, next) => {
    req.historyType = "sellHistory";
    next();
  },
  gethistory
);

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
