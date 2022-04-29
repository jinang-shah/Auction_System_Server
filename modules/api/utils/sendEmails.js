const nodemailer = require("nodemailer");
const { getMaxListeners } = require("../../../model/user");

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        // host: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        // secure: true,
        auth: {
            user: 'krunal.thakkar.sa@gmail.com',
            pass: 'krunal@825',
        },
    });

    const mailOption = {
        from: 'krunal.thakkar.sa@gmail.com',
        to: options.to,
        subject: options.subject,
        html: options.text,
    };

    transporter.sendMail(mailOption, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
};

module.exports = sendEmail;