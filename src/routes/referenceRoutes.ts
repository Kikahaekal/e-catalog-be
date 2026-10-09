import { Router } from "express";
import {
    createReference,
    deleteReference,
    editReference,
    getAllReferences,
    getReference,
} from "../controller/referenceController.ts";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.ts";

const router = Router();

/**
 * @openapi
 * /api/reference:
 *   post:
 *     tags: [References]
 *     summary: Membuat data referensi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReferenceRequest'
 *     responses:
 *       201:
 *         description: Data referensi berhasil dibuat
 */
router.post("/", authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), createReference);

/**
 * @openapi
 * /api/reference/{referenceId}:
 *   put:
 *     tags: [References]
 *     summary: Mengubah data referensi
 *     parameters:
 *       - in: path
 *         name: referenceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReferenceRequest'
 *     responses:
 *       200:
 *         description: Data referensi berhasil diperbarui
 */
router.put("/:referenceId", authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), editReference);

/**
 * @openapi
 * /api/reference/{referenceId}:
 *   delete:
 *     tags: [References]
 *     summary: Menghapus data referensi
 *     parameters:
 *       - in: path
 *         name: referenceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data referensi berhasil dihapus
 */
router.delete("/:referenceId", authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), deleteReference);

/**
 * @openapi
 * /api/reference/{referenceId}:
 *   get:
 *     tags: [References]
 *     summary: Melihat referensi berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: referenceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data referensi berhasil diambil
 */
router.get("/:referenceId", getReference);

/**
 * @openapi
 * /api/reference:
 *   get:
 *     tags: [References]
 *     summary: Melihat semua referensi
 *     responses:
 *       200:
 *         description: Daftar referensi berhasil diambil
 */
router.get("/", getAllReferences);

export default router;
