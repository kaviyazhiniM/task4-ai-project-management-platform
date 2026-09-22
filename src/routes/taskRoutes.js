const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

const taskValidationRules = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('project').isMongoId().withMessage('A valid project id is required'),
  body('assignee').optional().isMongoId().withMessage('Invalid assignee id'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid date'),
];

const statusValidationRules = [
  body('status')
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
];

router.post('/', taskValidationRules, validate, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.patch('/:id/status', statusValidationRules, validate, updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;
