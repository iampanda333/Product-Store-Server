const User = require('../models/user');
const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
    if (req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];

        const { username, exp } = await jwt.verify(accessToken, process.env.Jwt_SECRET);
        // Check if token has expired
        if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({ error: "Token is expired, Login again" });
        }


        User.findAll({ limit: 1, where: { username: username } }).then(function (user) {
            if (!user) {
                return res.status(404).json({ success: false, message: 'Authentication failed!' });
            } else {
                res.locals.loggedInUser = user[0].dataValues;
                next();
            }
        }).catch(err => {
            return res.status(500).send({
                success: false,
                message: "Authentication Error"
            })
        })
    } else {
        next();
    }
}

const allowIfLoggedin = async (req, res, next) => {
    try {
        console.log(res.locals.loggedInUser);
        const user = res.locals.loggedInUser;
        if (!user) {
            console.log('Test')
            return res.status(401).json({
                success: false,
                error: "You need to be logged in to access this route"
            });
        }
        next();
    } catch (error) {
        res.status(400).send({ success: false, error: 'User should be login ' });
    }
}

module.exports = {
    validateToken,
    allowIfLoggedin
}