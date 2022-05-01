const express = require("express");
const router = express.Router();
const User = require("../../../model/user");
let Complain = require("../../../model/complain");
const user = require("./admin/user");
const product  = require('./admin/product')

router.use('/product',product)
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

// Get complainlist
router.get('/complainlist', async (req,res)=>{
    console.log("admin complain");

    try{
        const complain =  await Complain.find()
        var data = []
        for(let i=0; i<complain.length; i++){
            data.push(await complain[i].populate('buyerId'))
        }
        const details = data.map((data) => {
            return {
                name:data.buyerId.name,
                date: data.date,
                id:data._id,
                status:data.isSolved
            }
        })
        res.send(details)
    }
    catch(error){
        console.log(error);
        res.send("Error")
    }
})
    

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
// Get perticular complain
router.get('/complains/:id', (req, res) => {
    try {
        Complain.findById(req.params.id, async(error, data) => {
            if (error) {
                console.log("complain id :", error);
                res.send("Error in getting product by id")
            } else {
                const buyer = await data.populate('buyerId')
                const seller = await data.populate('sellerId')
                const product = await data.populate('productId')
                    // console.log(buyer.buyerId.name);
                    //console.log(data);
                const details = {
                    buyer_name: buyer.buyerId.name,
                    seller_name: seller.sellerId.name,
                    product_name: product.productId.name,
                    complain_details: data.complainDetails,
                    images: data.images
                }
                console.log(details);
                res.json(details)
            }
        })
    } catch {

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
// get all users (admin-manage-users)
router.get("/users", async(req, res) => {
    await User.find()
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            res.send("error in fetching user", err);
        });
});

//Complain Solved or Pending
router.patch('/complain/solve/:id',async (req,res)=>{
    console.log("sta",req.body.status,"id:",req.params.id);
    await Complain.findByIdAndUpdate(req.params.id,{isSolved:req.body.status})
    .then((data)=>{
        console.log(data);
        res.status(202).send(data);
    })
    .catch((err)=>{
        console.log("error while verifing complain",err)
        res.status(404).send({message:"error while verifing complain",err})
    })
})
    

module.exports = router;
