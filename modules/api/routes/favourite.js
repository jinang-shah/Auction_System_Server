const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth_middleware");

// get all favourite products
router.get("/favourite", auth, async (req, res) => {
  let count = req.user.favouriteProducts.length;
  let itemsPerPage = parseInt(req.query.itemsPerPage) || 5;
  let skip = (parseInt(req.query.pageNo) - 1 || 0) * itemsPerPage;
  console.log(skip, skip + itemsPerPage);
  req.user.favouriteProducts = req.user.favouriteProducts.slice(
    skip,
    skip + itemsPerPage
  );
  await req.user.populate("favouriteProducts");
  res.send({
    products: req.user.favouriteProducts,
    totalPages: Math.ceil(count / itemsPerPage),
  });
});

// add product to favourite
router.post("/favourite/:productId", auth, async (req, res) => {
  let pId = req.params.productId;
  if (!pId) {
    res.status(400).send({
      msg: "Product ID not found",
    });
  }
  let index = req.user.favouriteProducts.indexOf(pId);
  if (index == -1) {
    req.user.favouriteProducts.push(pId);

    // for notification
    let when = req.body.when;
    req.user.notifications.push({ productId: pId, when });
    await req.user.save();
    res.send({ msg: "added" });
  } else {
    res.send({ msg: "already added" });
  }
});

// remove product from favourite
router.delete("/favourite/:productId", auth, async (req, res) => {
  let pId = req.params.productId;
  if (!pId) {
    res.status(400).send({
      msg: "Product ID not found",
    });
  }
  req.user.notifications = req.user.notifications.filter(
    (n) => n.productId != pId
  );
  req.user.favouriteProducts = req.user.favouriteProducts.filter(
    (id) => pId !== id.toString()
  );
  await req.user.save();
  res.send({ msg: "removed" });
});

module.exports = router;
