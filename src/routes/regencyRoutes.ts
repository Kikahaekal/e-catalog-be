import { Router } from "express";
import { createRegency, deleteRegency, editRegency, getAllRegencies, getRegencies } from "../controller/regencyController";
import { authenticateToken, requireRole } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), createRegency);
router.put('/:regencyId', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), editRegency);
router.delete('/:regencyId', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), deleteRegency);
router.get('/:regencyId', getRegencies);
router.get('/', getAllRegencies);

export default router;
