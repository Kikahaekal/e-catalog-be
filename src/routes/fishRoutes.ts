import { Router } from 'express';
import { submitFishName, getAllFishSubmissions, approveSubmission, rejectSubmission } from '../controller/fishController.ts';
import { upload } from '../middleware/upload.ts';

const router = Router();

/**
 * @openapi
 * /api/fish/submit:
 *   post:
 *     tags: [Fish Submissions]
 *     summary: Mengirim usulan nama ikan
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [submittedName, photoFilePath]
 *             properties:
 *               submittedName:
 *                 type: string
 *               locationNote:
 *                 type: string
 *               submitterName:
 *                 type: string
 *               photoFilePath:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Usulan berhasil disimpan
 *       400:
 *         description: Nama atau foto tidak valid
 */
router.post('/submit', upload.single('photoFilePath'), submitFishName);

/**
 * @openapi
 * /api/fish/approve/{submissionId}:
 *   post:
 *     tags: [Fish Submissions]
 *     summary: Menyetujui usulan ikan
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [speciesId]
 *             properties:
 *               speciesId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission berhasil disetujui
 *       400:
 *         description: Data input tidak valid
 *       404:
 *         description: Submission tidak ditemukan
 */
router.post('/approve/:submissionId', approveSubmission);

/**
 * @openapi
 * /api/fish/submissions:
 *   get:
 *     tags: [Fish Submissions]
 *     summary: Melihat semua usulan nama ikan
 *     responses:
 *       200:
 *         description: Daftar usulan berhasil diambil
 */
router.get('/submissions', getAllFishSubmissions);

/**
 * @openapi
 * /api/fish/reject/{submissionId}:
 *   delete:
 *     tags: [Fish Submissions]
 *     summary: Menolak usulan nama ikan
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submission berhasil ditolak
 *       404:
 *         description: Submission tidak ditemukan
 */
router.delete('/reject/:submissionId', rejectSubmission);

export default router;