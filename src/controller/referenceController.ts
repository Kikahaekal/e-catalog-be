import { type Request, type Response } from "express";
import { db } from "../prisma/db.ts";

const serializeBigInt = (value: unknown) => JSON.parse(
    JSON.stringify(value, (_, item) => typeof item === "bigint" ? item.toString() : item)
);

const parseReferenceId = (value: string | string[]): number | null => {
    if (Array.isArray(value)) return null;
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

export const createReference = async (req: Request, res: Response): Promise<any> => {
    try {
        const { refCode, authors, year, title, source } = req.body;

        if (!authors || !title) {
            return res.status(400).json({ error: "Penulis dan judul referensi wajib diisi" });
        }

        const reference = await db.orm.public.Reference.create({
            refCode: refCode ?? null,
            authors,
            year: year ?? null,
            title,
            source: source ?? null,
        });

        return res.status(201).json({
            message: "Data referensi berhasil dibuat",
            data: serializeBigInt(reference),
        });
    } catch (error) {
        console.error("Error saat membuat data referensi:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menyimpan data referensi" });
    }
};

export const editReference = async (req: Request, res: Response): Promise<any> => {
    try {
        const referenceId = parseReferenceId(req.params.referenceId);
        const { refCode, authors, year, title, source } = req.body;

        if (!referenceId) {
            return res.status(400).json({ error: "ID referensi tidak valid" });
        }
        if (!authors || !title) {
            return res.status(400).json({ error: "Penulis dan judul referensi wajib diisi" });
        }

        const reference = await db.orm.public.Reference.where({ id: BigInt(referenceId) }).update({
            refCode: refCode ?? null,
            authors,
            year: year ?? null,
            title,
            source: source ?? null,
        });

        if (!reference) {
            return res.status(404).json({ error: "Data referensi tidak ditemukan" });
        }

        return res.status(200).json({
            message: "Data referensi berhasil diperbarui",
            data: serializeBigInt(reference),
        });
    } catch (error) {
        console.error("Error saat memperbarui data referensi:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat memperbarui data referensi" });
    }
};

export const deleteReference = async (req: Request, res: Response): Promise<any> => {
    try {
        const referenceId = parseReferenceId(req.params.referenceId);
        if (!referenceId) {
            return res.status(400).json({ error: "ID referensi tidak valid" });
        }

        const reference = await db.orm.public.Reference.where({ id: BigInt(referenceId) }).delete();
        if (!reference) {
            return res.status(404).json({ error: "Data referensi tidak ditemukan" });
        }

        return res.status(200).json({ message: "Data referensi berhasil dihapus" });
    } catch (error) {
        console.error("Error saat menghapus data referensi:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menghapus data referensi" });
    }
};

export const getReference = async (req: Request, res: Response): Promise<any> => {
    try {
        const referenceId = parseReferenceId(req.params.referenceId);
        if (!referenceId) {
            return res.status(400).json({ error: "ID referensi tidak valid" });
        }

        const reference = await db.orm.public.Reference.where({ id: BigInt(referenceId) }).first();
        if (!reference) {
            return res.status(404).json({ error: "Data referensi tidak ditemukan" });
        }

        return res.status(200).json({
            message: "Data referensi berhasil diambil",
            data: serializeBigInt(reference),
        });
    } catch (error) {
        console.error("Error saat mengambil data referensi:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data referensi" });
    }
};

export const getAllReferences = async (_req: Request, res: Response): Promise<any> => {
    try {
        const references = await db.orm.public.Reference.all();
        return res.status(200).json({
            message: "Data referensi berhasil diambil",
            data: serializeBigInt(references),
        });
    } catch (error) {
        console.error("Error saat mengambil data referensi:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data referensi" });
    }
};
