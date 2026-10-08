import { Router } from 'express';
import { createIucn, editIucn, deleteIucn, getIucn, getAllIucn } from '../controller/iucnController.ts';

const router = Router();

/**
 * @openapi
 * /api/iucn:
 *   post:
 *     tags: [IUCN]
 *     summary: Membuat status IUCN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IucnRequest'
 *     responses:
 *       201:
 *         description: Data IUCN berhasil dibuat
 */
router.post('/', createIucn);

/**
 * @openapi
 * /api/iucn/{iucnId}:
 *   put:
 *     tags: [IUCN]
 *     summary: Mengubah status IUCN
 *     parameters:
 *       - in: path
 *         name: iucnId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IucnRequest'
 *     responses:
 *       200:
 *         description: Data IUCN berhasil diperbarui
 */
router.put('/:iucnId', editIucn);

/**
 * @openapi
 * /api/iucn/{iucnId}:
 *   delete:
 *     tags: [IUCN]
 *     summary: Menghapus status IUCN
 *     parameters:
 *       - in: path
 *         name: iucnId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data IUCN berhasil dihapus
 */
router.delete('/:iucnId', deleteIucn);

/**
 * @openapi
 * /api/iucn/{iucnId}:
 *   get:
 *     tags: [IUCN]
 *     summary: Melihat status IUCN berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: iucnId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data IUCN berhasil diambil
 */
router.get('/:iucnId', getIucn);

/**
 * @openapi
 * /api/iucn:
 *   get:
 *     tags: [IUCN]
 *     summary: Melihat semua status IUCN
 *     responses:
 *       200:
 *         description: Daftar status IUCN berhasil diambil
 */
router.get('/', getAllIucn);

export default router;