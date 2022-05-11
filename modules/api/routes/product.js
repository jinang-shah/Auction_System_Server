const express = require("express");
const multer = require("multer");
const router = express.Router();
// const emplist = require('../../../model/user')
let Product = require("../../../model/product");
let Complain = require("../../../model/complain");
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
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("comments.senderId")
      .populate("bidDetails.bidderId")
      .populate("sellerId");
    res.send(product);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//additem
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

router.post(
  "/additem",
  upload.fields([
    { name: "bill", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  auth,
  async (req, res) => {
    console.log(req.files);
    req.body.bill = req.files.bill.map((x) => x.path);
    req.body.images = req.files.images.map((x) => x.path);
    var emp = new Product(req.body); /////
    const user = req.user;
    user.sellHistory.push(emp._id);
    await user.save();
    emp.save((err, doc) => {
      if (!err) {
        res.send(doc);
        // console.log(req.file)
      } else {
        console.log(
          "Error in Employee Save :" + JSON.stringify(err, undefined, 2)
        );
      }
    });
  }
);

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

var dt = new Date();
var startDate = dt.setDate(dt.getDate() + 2);
var endDate = dt.setDate(dt.getDate() + 10);

//create new product
router.post('/create-product', (req, res) => {
    Product.create({
        name: "Panasonic 90 cm (52 inches)",
        description: "Display: A+ Grade Panel | IPE Technology | True Colour | Cinema Zoom | Slim Bezel | Cinema Mode",
        category: "Electronics",
        sellerId: "626df31d822702e304d12467",
        basePrice: 300,
        images: [
          "https://m.media-amazon.com/images/I/71ftZH+DJML._SL1500_.jpg",
          "https://m.media-amazon.com/images/I/61g19u3wPaL._SL1500_.jpg",
          "https://m.media-amazon.com/images/I/61+fbhu7ieL._SL1500_.jpg",
          "https://m.media-amazon.com/images/I/61AHZa1lEgL._SL1500_.jpg"
        ],
        startDate: startDate,
        endDate: endDate,

    }, (error, data) => {
        if (error) {
            console.log("error in add product", error)
            res.send({ error: "error in adding product" })
        }
        else {
            console.log(data)
            res.send(data);
        }
    })
})


// To add complain
router.post(
  "/complain",
  upload.fields([{ name: "images", maxCount: 1 }]),
  (req, res) => {
    console.log(req.files);
    req.body.images = req.files.images.map((x) => x.path);
    var emp = new Complain(req.body);
    emp.save((err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        console.log(
          "Error in Employee Save :" + JSON.stringify(err, undefined, 2)
        );
      }
    });
  }
);

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

module.exports = router;
