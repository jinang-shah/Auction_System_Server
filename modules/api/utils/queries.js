const mongoose = require('mongoose')
const User = require('../../../model/user')

const getUserName = async (_id) => {
    const user1 = await User.findOne({_id});
    console.log("user 1",user1)
    return user1.name
}

module.exports = getUserName