const express = require('express');
const protect = require('../middleware/protect');
const { generateTasks } = require('../controllers/aiController');

const router = express.Router();

router.use(protect);
router.post('/generate-tasks', generateTasks);

module.exports = router;
