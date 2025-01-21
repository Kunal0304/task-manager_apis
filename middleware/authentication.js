const jwt = require('jsonwebtoken')
require('dotenv').config();



const authentication = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, process.env.secret_key, (err, auth) => {
        if (err) {
            return err
        }
        else {
           req.user = {
            adminId: auth.id,
            role: auth.role,
            name: auth.name,
            userName: auth.userName
        };
            next()
        }
    })

}

module.exports = authentication;