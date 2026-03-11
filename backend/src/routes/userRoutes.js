import express from 'express';
import * as userController from '../controllers/userControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

// Protected routes (authentication required)
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.get('/email/:email', authenticateToken, userController.getUserByEmail);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

export default router;