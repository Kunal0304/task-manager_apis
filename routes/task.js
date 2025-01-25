var express = require('express')
var router = express.Router();
var { Task } = require('../models/index')
var authentication = require('../middleware/authentication')
require('dotenv').config();
const { Op } = require('sequelize');


router.post("/", authentication, async (req, res) => {
    const { title, description, priority, assignedUsers, dueDate, status } = req.body;
    const adminId = req.user.adminId;
    try {
        const users = Array.isArray(assignedUsers) ? assignedUsers : [assignedUsers];

        const response = await Task.create({
            title, description, priority,
            assignedUsers: users,

            dueDate, status, adminId
        });

        // Emit socket event for task creation
        if (req.io) {
            req.io.emit('newTaskCreated', {
                task: response,
                assignedUsers: users
            });
        }

        return res.status(200).json({ message: "Task Added successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
})

router.get("/", authentication, async (req, res) => {
    const { role, userName } = req.user;
    const adminId = req.user.adminId;

    try {
        if (role === 'Admin') {

            const tasks = await Task.findAll({ where: { adminId: adminId } });
            return res.status(200).json(tasks);
        } else if (role === 'User') {
            const tasks = await Task.findAll({ where: { assignedUsers: { [Op.contains]: [userName] } } });
            return res.status(200).json(tasks);
        } else {
            return res.status(403).json({ message: "Unauthorized access" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


router.put("/:id", authentication, async (req, res) => {
    const taskId = req.params.id;
    const { status, priority, assignedUsers, title, description, dueDate } = req.body;

    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (status) task.status = status;
        if (priority) task.priority = priority;
        if (assignedUsers) {
            task.assignedUsers = Array.isArray(assignedUsers) ? assignedUsers : [assignedUsers];
        }
        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;
        await task.save();

        // Emit socket event for status update
        if (req.io) {
            req.io.emit('taskStatusUpdated', {
                task: task,
                updatedBy: {
                    id: req.user.id,
                    name: req.user.name,
                    role: req.user.role
                }
            });
        }

        res.status(200).json({ message: 'Task updated successfully', data: task });
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
})

router.get("/:id", authentication, async (req, res) => {
    const id = req.params.id

    try {
        const response = await Task.findOne({ where: { id: id } });
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
})

router.delete("/:id", authentication, async (req, res) => {
    const adminId = req.user.adminId;
    const id = req.params.id;
    try {
        const response = await Task.destroy({ where: { adminId: adminId, id: id } });
        if (response === 0) {
            return res.status(404).json({ message: "No user found with the given criteria." });
        }
        return res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error("Error during deletion:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;