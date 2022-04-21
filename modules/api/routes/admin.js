
const express = require('express')
const router = express.Router()
let Complain = require('../../../model/complain');
const User = require("../../../model/user");



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

// get all users (admin-manage-users)
router.get("/users", async (req, res) => {
  await User.find()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.send("error in fetching user", err);
    });
});

module.exports = router;
