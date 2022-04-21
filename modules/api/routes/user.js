const express = require('express')
const User = require('../../../model/user')
const router = express.Router()
const bcrypt = require('bcryptjs')
const sendEmail = require("../utils/sendEmails");
const crypto = require("crypto");

//change password
router.post('/change-password', async(req, res) => {
    console.log(req.body);

    res.send({ msg: "done" });
})

//reset password

router.post('/reset-password/:resetToken', async(req, res, next) => {
    try {
        console.log(req.params.resetToken);
        const resetPasswordToken = crypto.createHash("sha256")
            .update(req.params.resetToken)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(new Error("Invalid reset Token", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        //console.log(user)
        await user.save();

        res.status(201).json({
            success: true,
            data: "password reset success",
        });
    } catch (error) {
        next(error);
    }

})

//forgot password
router.post('/forgot-password', async(req, res, next) => {

    const { email } = req.body;
    console.log({ email });

    try {
        const user = await User.findOne({ email });
        // console.log(user);

        if (!user) {
            return next(new Error("Email could not be sent, no user", 404));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:4200/#/reset-password/${resetToken}`;

        const message = `
        <h1>You have requested a password reset</h1>
        <p>please go to this link to reset your password</p>
        <a href = ${resetUrl} clicktracking=off>${resetUrl}</a>
      `;

        try {
            await sendEmail({
                to: user.email,
                subject: "password reset request",
                text: message,
            });
            res.status(200).json(resetToken);

        } catch (error) {
            user.resetpasswordToken = undefined;
            user.resetpasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be sent !", 500));
        }
    } catch (error) {
        next(error);
    }
});








router.post('/home', (req, res) => {
    console.log(req.body)
    res.send("Hello")
})

//login
router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.send("Invalid user")
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.password)
        console.log("isValidPAss :", isValidPass)

        if (isValidPass) {
            const token = await user.generateAuthToken()
            res.status(200).send({ user, token })
        } else {
            res.status(401).send("Invalid email or password")
        }


    } catch (err) {
        console.log("Error while login", err)
        res.send({ message: "Error while login", error: err })
    }
})

// register
router.post('/register', async(req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
            // const user = await User.create(req.body)

    } catch (error) {
        res.status(500).send({ message: "error in creating user", error })
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
router.patch('/edit/:id', async(req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then((data) => {
            console.log(data);
            res.status(202).send(data);
        })
        .catch((err) => {
            console.log("error while updating user details", err)
            res.status(404).send("error while updating user details")
        })
})

//fetch all users
router.get('/', async(req, res) => {
    await User.find()
        .then((data) => {
            console.log(data)
            res.status(200).send(data)
        })
        .catch((err) => {
            res.send("error in fetching user", err)
        })
})

//fetch user by id
router.get('/:id', async(req, res) => {
    await User.findById(req.params.id)
        .then((data) => {
            console.log(data)
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(404).send("error in getting user by id", err)
        })
})

module.exports = router;