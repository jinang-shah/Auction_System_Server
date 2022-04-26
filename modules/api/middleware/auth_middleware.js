const jwt = require("jsonwebtoken");
const User = require("../../../model/user");

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("cookkies here", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate" });
    }
};

module.exports = auth;