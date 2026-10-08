import { Router, type Request, type Response  } from 'express';
import { submitFishName, approveSubmission, rejectSubmission } from '../controller/fishController.ts';
import { upload } from '../middleware/upload.ts';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.ts';

const router = Router();

//photofilepath itu nama field di formnya, jadi harus sama
router.post('/submit', upload.single('photoFilePath'), submitFishName);
router.post('/approve/:submissionId', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), approveSubmission);
router.delete('/reject/:submissionId', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), rejectSubmission);

export default router;