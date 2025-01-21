var express = require('express');
var router = express.Router();
var { user } = require('../models/index')
var bcrypt = require('bcrypt')


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

module.exports = router;
