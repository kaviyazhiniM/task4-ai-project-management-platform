const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const protect = require('../middleware/protect');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();
router.use(protect);

const projectValidationRules = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('owner').isMongoId().withMessage('A valid owner (User) id is required'),
  body('status').optional().isIn(['active', 'archived']).withMessage('Invalid status'),
];

router.post('/', projectValidationRules, validate, createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
