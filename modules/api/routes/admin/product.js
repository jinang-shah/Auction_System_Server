const express = require('express');
const { verify } = require('jsonwebtoken');
const Product = require('../../../../model/product')
const router = express.Router()


// verified product

router.patch('/verify/:id',async (req,res)=>{
    console.log(req.body.status,req.params.id);
    await Product.findByIdAndUpdate(req.params.id,{isVerified:req.body.status})
    .then((data)=>{
        console.log(data);
        res.status(202).send(data);
    })
    .catch((err)=>{
        console.log("error while verifing product",err)
        res.status(404).send({message:"error while verifing product",err:error})
    })
})


router.get('/', async(req, res) => {
    try {
        const product = await Product.find().populate("comments.senderId").populate("bidDetails.bidderId")
        res.send(product);
    } catch (error) {
        console.log(error);
        res.send(error)
    }

    //delete user by id
router.delete("/:id", async (req, res) => {
    console.log("product delete api");
    try {
      console.log("delete id", req.params.id);
      await Product.findOneAndRemove(req.params.id).then((data) => {
        res.send(data);
        console.log(data);
      });
    } catch (error) {
      res.send(err);
    }
  });
})



module.exports = router;