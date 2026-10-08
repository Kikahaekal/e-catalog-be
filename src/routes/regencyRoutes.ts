import { Router } from "express";
import { createRegency, deleteRegency, editRegency, getAllRegencies, getRegencies } from "../controller/regencyController";

const router = Router();

/**
 * @openapi
 * /api/regency:
 *   post:
 *     tags: [Regency]
 *     summary: Membuat data kabupaten/kota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegencyRequest'
 *     responses:
 *       201:
 *         description: Data kabupaten/kota berhasil dibuat
 */
router.post('/', createRegency);

/**
 * @openapi
 * /api/regency/{regencyId}:
 *   put:
 *     tags: [Regency]
 *     summary: Mengubah data kabupaten/kota
 *     parameters:
 *       - in: path
 *         name: regencyId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegencyRequest'
 *     responses:
 *       200:
 *         description: Data kabupaten/kota berhasil diperbarui
 */
router.put('/:regencyId', editRegency);

/**
 * @openapi
 * /api/regency/{regencyId}:
 *   delete:
 *     tags: [Regency]
 *     summary: Menghapus data kabupaten/kota
 *     parameters:
 *       - in: path
 *         name: regencyId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data kabupaten/kota berhasil dihapus
 */
router.delete('/:regencyId', deleteRegency);

/**
 * @openapi
 * /api/regency/{regencyId}:
 *   get:
 *     tags: [Regency]
 *     summary: Melihat kabupaten/kota berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: regencyId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data kabupaten/kota berhasil diambil
 */
router.get('/:regencyId', getRegencies);

/**
 * @openapi
 * /api/regency:
 *   get:
 *     tags: [Regency]
 *     summary: Melihat semua kabupaten/kota
 *     responses:
 *       200:
 *         description: Daftar kabupaten/kota berhasil diambil
 */
router.get('/', getAllRegencies);

export default router;
