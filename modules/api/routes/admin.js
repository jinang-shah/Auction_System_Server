const express = require('express')
const router = express.Router()
const product  = require('./admin/product')




router.use('/product',product)




module.exports = router;