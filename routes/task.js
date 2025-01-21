var express = require('express')
var app = express();
var { Task } = require('../models/index')
var authentication = require('../middleware/authentication')
require('dotenv').config();
const { Op } = require('sequelize');


app.post("/tasks", authentication, async (req, res) => {
    const { title, description, priority, assignedUsers, dueDate, status } = req.body;
    const adminId = req.user.adminId;

    try {
        const users = Array.isArray(assignedUsers) ? assignedUsers : [assignedUsers];

        const response = await Task.create({
            title, description, priority,
            assignedUsers: users,

            dueDate, status, adminId
        });
        return res.status(200).json({ message: "Taks Added successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
})

app.get("/tasks", authentication, async (req, res) => {
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


app.get("/tasks/:id", authentication, async (req, res) => {
    const id = req.params.id

    try {
        const response = await Task.findOne({ where: { id: id } });
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
})

app.put("/tasks/:id", authentication, async (req, res) => {

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
        res.status(200).json({ message: 'Task updated successfully', data: task });
    } catch (error) {
        console.log("eeee", error)
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
})

app.delete("/tasks/:id", authentication, async (req, res) => {
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

module.exports = app