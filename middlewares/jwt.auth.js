const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.authToken = function authToken(req, res, next) {
    const token = req.header('Bearer');
    if (!token)
        return res.status(401).json({ message: 'No authorization token can be found, Please try again' })

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        console.log(err, 'err');
        console.log('.......USER......', user);
        if (err) return res.status(400).json({ message: 'Your session expired,Please login again' });
        req.user = user;
        next();
    });
}