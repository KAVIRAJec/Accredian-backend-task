const express = require('express');
const router = express.Router();
const taskController = require('../controllers/user');

router.post('/signup', taskController.signup);
router.post('/login', taskController.login);

module.exports = router;