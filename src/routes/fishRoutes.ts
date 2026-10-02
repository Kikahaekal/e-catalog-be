import { Router, type Request, type Response  } from 'express';
import { submitFishName, getAllFishSubmissions, approveSubmission, rejectSubmission } from '../controller/fishController.ts';
import { upload } from '../middleware/upload.ts';

const router = Router();

//photofilepath itu nama field di formnya, jadi harus sama
router.post('/submit', upload.single('photoFilePath'), submitFishName);
router.post('/approve/:submissionId', approveSubmission);
router.get('/submissions', getAllFishSubmissions);
router.delete('/reject/:submissionId', rejectSubmission);

export default router;