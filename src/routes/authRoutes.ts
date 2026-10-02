import { Router } from 'express';
import { login, logout } from '../controller/authController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

export default router;