import { Router } from "express";
import { getSpecies, createSpecies, deletesSpecies, editSpecies, getAllSpecies } from "../controller/speciesController";
import { authenticateToken, requireRole } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), createSpecies);
router.put('/:speciesId', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), editSpecies);
router.delete('/:speciesId', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), deletesSpecies);
router.get('/:speciesId', getSpecies);
router.get('/', getAllSpecies);

export default router;