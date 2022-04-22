const express = require('express')
const router = express.Router()
let Complain = require('../../../model/complain');



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
                date: data.date
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