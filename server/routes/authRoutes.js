import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { check } from 'express-validator';

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role must be either buyer or seller').optional().isIn(['buyer', 'seller']),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

export default router;
