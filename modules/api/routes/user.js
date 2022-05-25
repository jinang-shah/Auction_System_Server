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
const {
  deleteNotifications,
  viewedNotification,
} = require("../utils/notification");
const { Console } = require("console");

router.use(favourite);

//change password
<<<<<<< HEAD
router.post("/change-password", auth, async (req, res) => {
  console.log("hange pass");
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
    res
      .status(200)
      .send({ message: "password changed successfully", isValid: true });
  } else {
    res.send({ message: "invalid old password", isValid: false });
  }
=======
router.post("/change-password", auth, async(req, res) => {
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
        // user.password = await bcrypt.hash(passwordDetails.newPassword, 8);
        user.password = passwordDetails.newPassword;

        await user.save();
        res.status(200).send({ message: "Password change sucessfully", user, isValid: true });
        console.log("Password change sucessfully");
    } else {
        res.send({ message: "Please enter a valid Old Password", user, isValid: false });

        console.log("Please enter a valid Password");
    }
>>>>>>> 993fd973b332b93d40c1f258c1efb1a9a15a9d0f
});

//reset password

<<<<<<< HEAD
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
=======
router.post("/reset-password/:resetToken", async(req, res, next) => {
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
            //return next(new Error("Invalid reset Token", 400));
            res.send({ message: "User not found", isValid: false })

        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        //console.log(user)
        await user.save();

        // res.status(201).json({
        //     success: true,
        //     data: "password reset success",
        // });
        res.status(200).send({ message: "Password changed successfully", isValid: true });
>>>>>>> 993fd973b332b93d40c1f258c1efb1a9a15a9d0f

    if (!user) {
      //return next(new Error("Invalid reset Token", 400));
      res.send({ message: "User not found", isValid: false });
    }

<<<<<<< HEAD
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    //console.log(user)
    await user.save();
=======
//forgot password
router.post("/forgot-password", async(req, res, next) => {
    const { email } = req.body;
    console.log({ email });
    let user
    try {
        user = await User.findOne({ email });
        // console.log(user);
>>>>>>> 993fd973b332b93d40c1f258c1efb1a9a15a9d0f

    res.status(201).json({
      success: true,
      data: "password reset success",
    });
    res
      .status(200)
      .send({ message: "password changed successfully", isValid: true });
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
      //return next(new Error("Email could not be sent, no user", 404));
      res.send({
        message: "Invalid Email! Please enter Valid Email",
        isValid: false,
      });
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
      // res.status(200).json(resetToken);
      res.send({
        message: "Please Check your mail id and Reset your password",
        isValid: true,
        data: { resetToken },
      });
    } catch (error) {
<<<<<<< HEAD
      user.resetpasswordToken = undefined;
      user.resetpasswordExpire = undefined;

      await user.save();

      // return next(new ErrorResponse("Email could not be sent! Please try again", 500));
      res.send({ message: "Please check your connection", isValid: false });
=======
        // user.resetpasswordToken = undefined;
        // user.resetpasswordExpire = undefined;

        // await user.save();

        // return next(new ErrorResponse("Email could not be sent !", 500));
        // res.send({ message: "Email could not be sent !", isValid: false })

>>>>>>> 993fd973b332b93d40c1f258c1efb1a9a15a9d0f
    }
  } catch (error) {
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;

    await user.save();

    return next(new ErrorResponse("Email could not be sent !", 500));
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
//$2a$10$O0lE7aMT0w94DQpioLEWze/MtiSRpZXHaz0V1iPotnald8qDJehp
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send({
    msg: "loggedout",
  });
});

router.post("/register", upload.single("aadharcard"), async (req, res) => {
  try {
    const user = new User(req.body);
    user.documents.aadharcard = req.file.path;
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res
      .status(200)
      .send({ message: "user registered", user, isRegistered: true });
    // const user = await User.create(req.body)
  } catch (error) {
    console.log(error);
    res.send({ message: "Error while registering", isRegistered: false });
  }
});

//update user details
router.patch("/edit/", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((data) => {
      res.status(202).send({ message: "Update done successfully" });
    })
    .catch((err) => {
      res.status(404).send({ message: "error while updating user details" });
    });
});

// get all notifications
router.get("/notifications", auth, async (req, res) => {
  const user = req.user;
  await user.populate("notifications.productId");
  res.status(200).send({ type: "success", data: user.notifications });
});

// set view true to all seen notifications
router.get("/notifications/view", auth, async (req, res) => {
  let user = req.user;
  user.notifications = viewedNotification(user.notifications);
  await req.user.save();
  res.send({ msg: "done" });
});

// delete notification by id and also delete previous notification of that product.
router.delete("/notification/:id", auth, async (req, res) => {
  let user = req.user;
  user.notifications = deleteNotifications(user.notifications, req.params.id);
  await user.save();
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
