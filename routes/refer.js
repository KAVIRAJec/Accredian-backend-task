const express = require('express');
const router = express.Router();
const taskController = require('../controllers/form');

router.post('/form', taskController.form);

module.exports = router;