import { Router } from 'express';
import { login } from '../controller/authController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();
router.post('/login', login);

export default router;