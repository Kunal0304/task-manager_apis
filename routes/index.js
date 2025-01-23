var express = require('express');
var app = express();
var authRouter = require('./auth');
var userRouter  =  require('./user')
var taskRouter  = require('./task')

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/tasks', taskRouter);

module.exports = app;