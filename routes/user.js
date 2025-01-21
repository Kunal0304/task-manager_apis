var express = require('express');
var router = express.Router();
var { user } = require('../models/index')
var bcrypt = require('bcrypt')
var authentication = require('../middleware/authentication')

router.post('/users', authentication, async function (req, res, next) {
    const { userName, passWord, role, name } = req.body;
    const adminId = req.user.adminId;  
    try {
        const userCheck = await user.findOne({ where: { userName: userName } })
        if (userCheck) {
            return res.status(409).json({ "message": "User already exists. Please choose a different email or username." })
        }
        else {
            bcryptPassword = await bcrypt.hash(passWord, 16)
            const response = await user.create({ userName, passWord: bcryptPassword, role, name, adminId: adminId })
            return res.status(200).json({ "message": "User Created successfully" })
        }
    } catch (error) {
        return res.status(500).json({ "message": "Internal server error." });
    }
});

router.get("/users", authentication, async (req, res) => {
    const adminId = req.user.adminId;  
    try {
        const response = await user.findAll({
            where: { adminId: adminId },
            attributes: { exclude: ['passWord',  'adminId'] }
        })
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).json({ "message": "Internal server error." });
    }
})

router.delete("/users/:id", authentication, async (req, res) => {
    const adminId = req.user.adminId;  
    const id = req.params.id; 
    try {
        const response = await user.destroy({ where: { adminId: adminId, id: id } });
        if (response === 0) {
            return res.status(404).json({ message: "No user found with the given criteria." });
        }
        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error during deletion:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.get("/users/:id", authentication, async (req, res) => {
    const adminId = req.user.adminId;  
    const id = req.params.id; 
    try {
        const response = await user.findAll({
            where: { adminId: adminId, id: id },
            attributes: { exclude: ['passWord', 'adminId'] }
        })
        return res.status(200).send(response)
    } catch (error) {
        console.error("Error during deletion:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/users/:id", authentication, async (req, res) => {
    const adminId = req.user.adminId;  
    const id = req.params.id; 
    const { userName, name } = req.body
    try {
        const existingUser = await user.findOne({
            where: { adminId: adminId, id: id },
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found or not authorized to update." });
        }
        await user.update(
            { userName, name }, 
            { where: { id: id, adminId: adminId } }
        );
        return res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        console.error("Error during deletion:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


module.exports = router;
