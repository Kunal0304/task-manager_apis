var express = require('express');
var router = express.Router();
var { user } = require('../models/index')
var bcrypt = require('bcrypt')
var jsonwebtoken = require('jsonwebtoken')



router.post('/signup', async function (req, res, next) {
  const { userName, passWord, role, name } = req.body;
  try {
    const userCheck = await user.findOne({ where: { userName: userName } })
    if (userCheck) {
      return res.status(409).json({ "message": "User already exists. Please choose a different email or username." })
    }
    else {
      bcryptPassword = await bcrypt.hash(passWord, 16)
      const response = await user.create({ userName, passWord: bcryptPassword, role, name })
      return res.status(200).json({ "message": "User Created successfully" })
    }

  } catch (error) {
    return res.status(500).json({ "message": "Internal server error." });
  }
});

router.post("/signin", async (req, res, next) => {
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
      return res.status(500).json({ "message": "Internal server error." });
  }
})

module.exports = router;
