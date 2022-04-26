const express = require("express");
const User = require("../../../model/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth_middleware");
const gethistory = require("../../../helper/gethistory");
const multer = require("multer");

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send("Invalid user");
    }
    const isValidPass = await bcrypt.compare(req.body.password, user.password);
    console.log("isValidPAss :", isValidPass);
    if (isValidPass) {
      const token = await user.generateAuthToken();
      res.status(200).send({ user, token });
    } else {
      res.send("Invalid email or password");
    }
  } catch (err) {
    console.log("Error while login", err);
    res.send({ message: "Error while login", err });
  }
});

// register
router.post("/register", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
    // const user = await User.create(req.body)
  } catch (error) {
    res.status(404).send({ msg: "error in create user", error });
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
      const obj = {
        pancard: req.files.pancard.map((x) => x.path).toString(),
        elecard: req.files.elecard.map((x) => x.path).toString(),
      };
      user.documents.push(obj);
      await user.save();
      res.send({ msg: "Documents Uploaded" });
    } catch (error) {
      res.status(404).send({ msg: "error in uploading Documents", error });
    }
  }
);

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
