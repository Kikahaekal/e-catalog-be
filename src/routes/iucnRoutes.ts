import { Router } from 'express';
import { createIucn, editIucn, deleteIucn, getIucn, getAllIucn } from '../controller/iucnController.ts';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), createIucn);
router.put('/:iucnId', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), editIucn);
router.delete('/:iucnId', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), deleteIucn);
router.get('/:iucnId', getIucn);
router.get('/', getAllIucn);

export default router;