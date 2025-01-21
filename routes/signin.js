var express = require('express')
var app = express();
var { user } = require('../models/index')
var jsonwebtoken = require('jsonwebtoken')
require('dotenv').config();
var bcrypt = require('bcrypt')

app.post("/signin", async (req, res) => {
    const { userName, passWord } = req.body;
    try {
        const userCheck = await user.findOne({ where: { userName: userName } })
        if (!userCheck) {
            return res.status(404).json({ "message": "User not found" })
        }
        else {
            const verify = await bcrypt.compare(passWord, userCheck.passWord)
            if (verify) {
                const role = userCheck.role
                const name = userCheck.name
                const id = userCheck.id
                var token = jsonwebtoken.sign({ id, role, name, userName }, process.env.secret_key, { 'expiresIn': '1h' })
                return res.status(200).json({ "message": "Sucessfully Login", token: token, role: role, name: name })
            }
            else {
                return res.status(401).json({ "message": "Unauthorized User" })
            }
        }
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ "message": "Internal server error." });
    }
})

module.exports = app