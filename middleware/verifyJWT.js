const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(403).json({ "message": "cannot authorized...!" });
    }
    // console.log(authHeader); /* bearer token */
    const token = authHeader.split(' ')[1];
    // console.log(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(401)
            req.username = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            // console.log("decoded username",username);
            next();
        }
    )

}
module.exports = verifyJWT;