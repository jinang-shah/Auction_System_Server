const express = require('express')
const router = express.Router()

const admin = require('./modules/api/routes/admin')
const user = require('./modules/api/routes/user')
const product = require('./modules/api/routes/product')

router.use('/admin', admin)
router.use('/user', user)
router.use('/product', product)


module.exports = router;
