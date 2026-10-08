import { Router } from "express"
import { createWpp,deleteWpp, editWpp, getAllWpp, getWpp } from "../controller/wppController"
import { authenticateToken, requireRole } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), createWpp);
router.put('/:wppId', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), editWpp);
router.delete('/:wppId', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), deleteWpp);
router.get('/:wppId', getWpp);
router.get('/', getAllWpp);

export default router;