const express = require("express");
const User = require("../../../model/user");
const router = express.Router();
const auth = require("../middleware/auth_middleware");

// get all favourite products
router.get("/favourite", auth, async (req, res) => {
  await req.user.populate("favouriteProducts");
  res.send(req.user.favouriteProducts);
});

// add product to favourite
router.post("/favourite", auth, async (req, res) => {
  if (!req.body.productId) {
    res.status(400).send({
      msg: "Product ID not found",
    });
  }
  req.user.favouriteProducts.push(req.body.productId);
  await req.user.save();
  res.send({ msg: "added" });
});

// remove product from favourite
router.delete("/favourite", auth, async (req, res) => {
  if (!req.body.productId) {
    res.status(400).send({
      msg: "Product ID not found",
    });
  }
  req.user.favouriteProducts = req.user.favouriteProducts.filter(
    (id) => req.body.productId !== id.toString()
  );
  await req.user.save();
  res.send({ msg: "removed" });
});

module.exports = router;
