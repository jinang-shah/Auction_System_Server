const express = require("express");
const router = express.Router();
const User = require("../../../model/user");
let Complain = require('../../../model/complain');

//fetch all users by admin

router.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    const data = user.map((d) => {
      return {
        name: d.name,
        email: d.email,
        mobile: d.mobile,
        status: d.isSeller,
      };
    });

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

//delete user by id
router.delete("/user/:id", async (req, res) => {
  try {
    console.log("delete id", req.params.id);
    const user = await User.findByIdAndDelete(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send("user deleted");
  } catch (e) {
    res.send(e);
  }
});

// Get complainlist

router.get('/complainlist',(req,res)=>{
    console.log("admin complain");
    try{
        Complain.find().then((data,error)=>{
            
            if(error){
                console.log("complainlist error :",error);
                res.send("Error in getting")
            }else{
               
                console.log(data);
                res.send(data);
            }
        })
    }
    catch{
        res.send("Error")
    }
})


// Get perticular complain
router.get('/:id',(req,res)=>{
    try{
    Complain.findById(req.params.id, async (error,data)=>{
        if(error){
            console.log("complain id :",error);
            res.send("Error in getting product by id")
        }else{
            const buyer = await data.populate('buyerId')
            const seller = await data.populate('sellerId')
            const product = await data.populate('productId')
            // console.log(buyer.buyerId.name);
            //console.log(data);
            const details = {
                buyer_name: buyer.buyerId.name,
                seller_name: seller.sellerId.name,
                product_name: product.productId.name,
                complain_details:data.complainDetails,
                images:data.images
            }
            console.log(details);
            res.json(details)
        }
    })
    }catch{

    }
})

module.exports = router;