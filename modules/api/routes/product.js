const express = require("express");
const router = express.Router();
let Product = require("../../../model/product");
const auth = require("../middleware/auth_middleware");

// get all products
router.get("/", async (req, res) => {
  const findObj = {};
  if (req.query.status) findObj.status = req.query.status;
  if (req.query.category) {
    findObj.category = { $regex: req.query.category, $options: "i" };
  }
  if (req.query.query) {
    let search = { $regex: req.query.query, $options: "i" };
    findObj["$or"] = [{ name: search }, { description: search }];
  }

  const limit = parseInt(req.query.itemsPerPage) || 1;
  const skip = (parseInt(req.query.pageNo) || 0) * limit;
  console.log(req.query);
  console.log(limit, skip);

  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const products = await Product.find(findObj)
      .sort(sort)
      .limit(limit)
      .skip(skip);
    res.send(products);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

// get product by id
router.get("/:id", (req, res) => {
  Product.findById(req.params.id, (error, data) => {
    if (error) {
      console.log("product by id :", error);
      res.send("Error in getting product by id");
    } else {
      res.json(data);
    }
  });
});

//create new product
router.post("/create-product", auth, (req, res) => {
  Product.create(
    {
      name: "item",
      description:
        "ROG Strix GT35, 8 Cores 10th Gen Intel Core i7-10700KF Gaming Desktop (32GB RAM/1TB HDD + 512GB SSD/Window 10/8GB NVIDIA GeForce RTX 2060 SUPER Graphics/with Keyboard & Mouse/Star Black), G35CZ-IN009T",
      category: "Fashion",
      sellerId: "WERHGFSFDGHFOIUY",
      basePrice: 200,
      images: [
        "https://m.media-amazon.com/images/I/81Ld2NSrrZL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71ozb7RIWLL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71-1FwQwQRL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/81Ylv058duL._SL1500_.jpg",
      ],
      startDate: new Date("2022-11-01"),
      endDate: new Date("2022-12-10"),
    },
    (error, data) => {
      if (error) {
        console.log("error in add product", error);
        res.send({ error: "error in adding product" });
      } else {
        console.log(data);
        res.send(data);
      }
    }
  );
});

module.exports = router;
