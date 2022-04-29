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


module.exports = router;