// routes/tasks.js
var express = require('express');
var router = express.Router();
var tasksController = require('../controllers/tasks.controller');
var middleware = require('../middleware');

router.use(middleware);

router
    .post('/', tasksController.create)
    .get('/:id', tasksController.getById)
    .get('/', tasksController.getAll);

module.exports = router;
