const express = require('express')
const User = require('../../../model/user')
const router = express.Router()
const bcrypt = require('bcryptjs')

//login
router.post('/login',async(req,res)=>{  
    try {
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.send("Invalid user")
        }
        const isValidPass = await bcrypt.compare(req.body.password,user.password)
        console.log("isValidPAss :",isValidPass)
        if(isValidPass){
            const token = await user.generateAuthToken()
            res.status(200).send({user,token})
        }
        else{
            res.send("Invalid email or password")
        }
        
    } catch (err) {
        console.log("Error while login",err)
        res.send("Error while login",err)
    }
})

// register
router.post('/register',async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password,8);
        const user  = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token}) 
        // const user = await User.create(req.body)
        
    } catch (error) {
        res.status(404).send("error in creating user",err)
    }
    
    // .then((data)=>{
    //     console.log(data)
    //     const token = 
    //     res.status(200).send(data)
    // }).catch((err)=>{
    //     res.status(404).send("error in creating user",err)
    // })
})

//update user details
router.patch('/edit/:id',async(req,res)=>{
    await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    .then((data)=>{
        console.log(data);
        res.status(202).send(data);
    })
    .catch((err)=>{
        console.log("error while updating user details",err)
        res.status(404).send("error while updating user details")
    })
})

//fetch all users
router.get('/',async (req,res)=>{
    await User.find()
    .then((data)=>{
        console.log(data)
        res.status(200).send(data)
    })
    .catch((err)=>{
        res.send("error in fetching user",err)
    })
})

//fetch user by id
router.get('/:id',async (req, res) => {
    await User.findById(req.params.id)
    .then((data)=>{
        console.log(data)
        res.status(200).send(data);
    })
    .catch((err)=>{
        res.status(404).send("error in getting user by id",err)
    })
})

module.exports = router;