const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header("token");

    if(!token) res.status(401).json({ message: 'Authentification Error'});

    try {
        const decode = jwt.verify(token, 'secret');
        req.user = decode.user;
        // console.log(req.user)
        next()
    } catch (err) {
        res.status(500).send({ message: 'Invalid token'});
    }
}

module.exports = auth;
