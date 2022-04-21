const express = require('express')
const multer = require('multer');
const router = express.Router()
// const emplist = require('../../../model/user')
let Product = require('../../../model/product');
let Complain = require('../../../model/complain');


// get all products
router.get('/',(req,res)=>{
    Product
    .find()
    .then((data)=>{
        res.status(200).send(data);
    })
    .catch((err)=>{
        console.log("error in getting product :",err)
        res.send("Error in Fetching products")
    })
})

// get product by id
router.get('/:id', (req, res) => {
    console.log("Hello product by id")
    Product.findById(req.params.id, (error, data) => {
        if (error) {
            console.log("product by id :", error);
            res.send("Error in getting product by id");
        }
        else {
            res.json(data)
        }
    })
})

//create new product
router.post('/create-product', (req, res) => {
    Product.create({
        name: "ROG Strix GT35",
        description: "ROG Strix GT35, 8 Cores 10th Gen Intel Core i7-10700KF Gaming Desktop (32GB RAM/1TB HDD + 512GB SSD/Window 10/8GB NVIDIA GeForce RTX 2060 SUPER Graphics/with Keyboard & Mouse/Star Black), G35CZ-IN009T",
        category: "Electronics",
        seller_id: "WERHGFSFDGHFOIUY",
        base_price: 2000,
        images: [
            "https://m.media-amazon.com/images/I/81Ld2NSrrZL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71ozb7RIWLL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71-1FwQwQRL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81Ylv058duL._SL1500_.jpg"
        ],
        start_date: Date.now(),
        end_date: Date.now()
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


//additem
const fileStorageEngine = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images/')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"--"+file.originalname);
    }
})

const upload = multer({storage:fileStorageEngine});

router.post('/additem',upload.fields([{name:"bill",maxCount:1},{name:"images",maxCount:4}]),(req, res) => {
    console.log(req.files);
    req.body.bill = req.files.bill.map(x => x.path);
    req.body.images = req.files.images.map(x => x.path);
    var emp = new Product(req.body); /////
    emp.save((err, doc) => {
        if (!err) { res.send(doc);
        // console.log(req.file)
     }
        else { console.log('Error in Employee Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

//Product complain


router.post('/complain',upload.fields([{name:"images",maxCount:1}]),(req, res) => {
    console.log(req.files);
    req.body.images = req.files.images.map(x => x.path);
    var emp = new Complain(req.body);
    emp.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Save :' + JSON.stringify(err, undefined, 2)); }
    });
});


module.exports = router;
