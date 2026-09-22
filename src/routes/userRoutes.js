const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

const userValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Role must be admin or member'),
];

router.post('/', userValidationRules, validate, createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
