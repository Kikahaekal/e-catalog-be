import { Router } from "express"
import { createWpp,deleteWpp, editWpp, getAllWpp, getWpp } from "../controller/wppController"

const router = Router();

/**
 * @openapi
 * /api/wpp:
 *   post:
 *     tags: [WPP]
 *     summary: Membuat zona WPP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WppRequest'
 *     responses:
 *       201:
 *         description: Data WPP berhasil dibuat
 */
router.post('/', createWpp);

/**
 * @openapi
 * /api/wpp/{wppId}:
 *   put:
 *     tags: [WPP]
 *     summary: Mengubah zona WPP
 *     parameters:
 *       - in: path
 *         name: wppId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WppRequest'
 *     responses:
 *       200:
 *         description: Data WPP berhasil diperbarui
 */
router.put('/:wppId', editWpp);

/**
 * @openapi
 * /api/wpp/{wppId}:
 *   delete:
 *     tags: [WPP]
 *     summary: Menghapus zona WPP
 *     parameters:
 *       - in: path
 *         name: wppId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data WPP berhasil dihapus
 */
router.delete('/:wppId', deleteWpp);

/**
 * @openapi
 * /api/wpp/{wppId}:
 *   get:
 *     tags: [WPP]
 *     summary: Melihat zona WPP berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: wppId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data WPP berhasil diambil
 */
router.get('/:wppId', getWpp);

/**
 * @openapi
 * /api/wpp:
 *   get:
 *     tags: [WPP]
 *     summary: Melihat semua zona WPP
 *     responses:
 *       200:
 *         description: Daftar WPP berhasil diambil
 */
router.get('/', getAllWpp);

export default router;