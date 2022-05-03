const express = require('express')
const router = express.Router()
const product  = require('./admin/product')

router.use('/product',product)

let Complain = require('../../../model/complain');
const User = require("../../../model/user");

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
})

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

