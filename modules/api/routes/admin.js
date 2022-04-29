const express = require("express");
const router = express.Router();
const User = require("../../../model/user");
let Complain = require("../../../model/complain");
const user = require("./admin/user");

//fetch all users by admin
router.use("user", user);

router.patch("/users/verify/:id", async (req, res) => {
  console.log(req.body.status, req.params.id);
  await User.findByIdAndUpdate(req.params.id, { isSeller: req.body.status });

  await User.findById(req.params.id)
    .then((data) => {
      console.log(data);
      res.status(202).send(data);
    })
    .catch((err) => {
      console.log("error while verifing product", err);
      res
        .status(404)
        .send({ message: "error while verifing product", err: error });
    });
});

router.get("/users", async (req, res) => {
  console.log("allusers");
  try {
    const user = await User.find({});
    const data = user.map((d) => {
      return {
        _id: d._id,
        name: d.name,
        email: d.email,
        mobile: d.mobile,
        status: d.isSeller,
      };
    });

    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

//delete user by id
router.delete("/user/:id", async (req, res) => {
  try {
    console.log("delete id", req.params.id);
    await User.findOneAndRemove(req.params.id).then((data) => {
      res.send(data);
      console.log(data);
    });
  } catch (error) {
    res.send(err);
  }
});

// Get complainlist

router.get("/complainlist", (req, res) => {
  console.log("admin complain");
  try {
    Complain.find().then((data, error) => {
      if (error) {
        console.log("complainlist error :", error);
        res.send("Error in getting");
      } else {
        console.log(data);
        res.send(data);
      }
    });
  } catch {
    res.send("Error");
  }
});

// Get perticular complain
router.get("/:id", (req, res) => {
  try {
    Complain.findById(req.params.id, async (error, data) => {
      if (error) {
        console.log("complain id :", error);
        res.send("Error in getting product by id");
      } else {
        const buyer = await data.populate("buyerId");
        const seller = await data.populate("sellerId");
        const product = await data.populate("productId");
        // console.log(buyer.buyerId.name);
        //console.log(data);
        const details = {
          buyer_name: buyer.buyerId.name,
          seller_name: seller.sellerId.name,
          product_name: product.productId.name,
          complain_details: data.complainDetails,
          images: data.images,
        };
        console.log(details);
        res.json(details);
      }
    });
  } catch {}
});

module.exports = router;
