import { Router } from "express";
import { getSpecies, createSpecies, deletesSpecies, editSpecies, getAllSpecies } from "../controller/speciesController";

const router = Router();

/**
 * @openapi
 * /api/species:
 *   post:
 *     tags: [Species]
 *     summary: Membuat data spesies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpeciesCreateRequest'
 *     responses:
 *       200:
 *         description: Data spesies berhasil ditambahkan
 *       400:
 *         description: Data input tidak valid
 */
router.post('/', createSpecies);

/**
 * @openapi
 * /api/species/{speciesId}:
 *   put:
 *     tags: [Species]
 *     summary: Mengubah data spesies
 *     parameters:
 *       - in: path
 *         name: speciesId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpeciesCreateRequest'
 *     responses:
 *       200:
 *         description: Data spesies berhasil diperbarui
 *       404:
 *         description: Data spesies tidak ditemukan
 */
router.put('/:speciesId', editSpecies);

/**
 * @openapi
 * /api/species/{speciesId}:
 *   delete:
 *     tags: [Species]
 *     summary: Menghapus data spesies
 *     parameters:
 *       - in: path
 *         name: speciesId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data spesies berhasil dihapus
 */
router.delete('/:speciesId', deletesSpecies);

/**
 * @openapi
 * /api/species/{speciesId}:
 *   get:
 *     tags: [Species]
 *     summary: Melihat detail spesies
 *     parameters:
 *       - in: path
 *         name: speciesId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data spesies berhasil diambil
 *       404:
 *         description: Data spesies tidak ditemukan
 */
router.get('/:speciesId', getSpecies);

/**
 * @openapi
 * /api/species:
 *   get:
 *     tags: [Species]
 *     summary: Melihat semua data spesies
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Memfilter hasil berdasarkan nama umum, nama ilmiah, atau nama lokal
 *     responses:
 *       200:
 *         description: Daftar spesies berhasil diambil
 */
router.get('/', getAllSpecies);

export default router;