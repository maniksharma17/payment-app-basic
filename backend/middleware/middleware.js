const JWT_SECRET_KEY = require("../config")
const jwt = require("jsonwebtoken")


function authMiddleware(req, res, next){
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')){
        res.json({})
    }

    token = header.split(" ")[1]
 
    try {
        const verifiedJWT = jwt.verify(token, JWT_SECRET_KEY)
        req.userID = verifiedJWT.userID
        next()
    } catch(err) {
        res.json({})
    }
}

module.exports = {
    authMiddleware
}