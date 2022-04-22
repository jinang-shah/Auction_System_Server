const express = require('express')
const User = require('../../../model/user')
const router = express.Router()
const bcrypt = require('bcryptjs')
const sendEmail = require("../utils/sendEmails");
const crypto = require("crypto");
const auth = require("../middleware/auth_middleware");

//change password
router.post('/change-password/:token', async(req, res, next) => {


    // Init Variables
    var passwordDetails = req.body;

    if (req.user) {
        if (passwordDetails.newPassword) {
            User.findById(req.user.id, function(err, user) {
                if (!err && user) {
                    if (user.authenticate(passwordDetails.oldaPssword)) {
                        if (passwordDetails.newPassword === passwordDetails.confirmPassword) {
                            user.password = passwordDetails.newPassword;

                            user.save(function(err) {
                                if (err) {
                                    return res.status(422).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                } else {
                                    req.login(user, function(err) {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            res.send({
                                                message: 'Password changed successfully'
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            res.status(422).send({
                                message: 'Passwords do not match'
                            });
                        }
                    } else {
                        res.status(422).send({
                            message: 'Current password is incorrect'
                        });
                    }
                } else {
                    res.status(400).send({
                        message: 'User is not found'
                    });
                }
            });
        } else {
            res.status(422).send({
                message: 'Please provide a new password'
            });
        }
    } else {
        res.status(401).send({
            message: 'User is not signed in'
        });
    }

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
        console.log(resetToken)
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

// auto login
router.get("/login", auth, (req, res) => {
    console.log("authorizedddd");
    console.log(req.user);
});


//login
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.send("Invalid user");
        }
        const isValidPass = await bcrypt.compare(req.body.password, user.password);
        if (isValidPass) {
            const token = await user.generateAuthToken();
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.status(200).send({ user });
        } else {
            res.send({ err: "Invalid email or password" });
        }
    } catch (err) {
        console.log("Error while login", err);
        res.send({ message: "Error while login", err });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.send({
        msg: "loggedout",
    });
});

// register
router.post("/register", async(req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(201).send({ user });
        // const user = await User.create(req.body)
    } catch (error) {
        res.status(404).send({ msg: "error in create user", error });
    }
});

//update user details
router.patch("/edit/:id", auth, async(req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        .then((data) => {
            console.log(data);
            res.status(202).send(data);
        })
        .catch((err) => {
            console.log("error while updating user details", err);
            res.status(404).send("error while updating user details");
        });
});

// todo: add authmiddleware
router.get("/notifications", auth, async(req, res) => {
    const user = req.user;
    await user.populate("notifications.productId");
    res.status(200).send({ type: "success", data: user.notifications });
});

router.delete("/notification/:id", auth, (req, res) => {
    console.log(req.user);

    res.status(200).send({ msg: "Notification Deleted" });
});

//fetch user by id
router.get("/:id", async(req, res) => {
    await User.findById(req.params.id)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(404).send({ err: "error in getting user by id" });
        });
});

module.exports = router;