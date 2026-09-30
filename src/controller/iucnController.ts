import { type Request, type Response } from "express";
import { db } from "../prisma/db.ts";

export const createIucn = async (req: Request, res: Response): Promise<any> => {
    try{
        const { code, name } = req.body;

        if(!code || !name) {
            return res.status(400).json({ error: "Kode dan nama wajib diisi" });
        }

        const iucn = await db.orm.public.IucnStatus.create({
            code,
            name,
        });

        const responseData = {
            ...iucn,
            id: iucn.id.toString(),
        }

        return res.status(201).json({
            message: "Data IUCN berhasil dibuat",
            data: responseData,
        });
    } catch (error) {
        console.error("Error saat membuat data IUCN:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menyimpan data IUCN" });
    }
}

export const editIucn = async (req: Request, res: Response): Promise<any> => {
    try{
        const { iucnId } = req.params;
        const { code, name } = req.body;

        if(!iucnId || typeof iucnId !== "string") {
            return res.status(400).json({ error: "ID IUCN wajib diisi" });
        }

        if(!code || !name) {
            return res.status(400).json({ error: "Kode dan nama wajib diisi" });
        }

        const iucn = await db.orm.public.IucnStatus.where({
            id: Number(iucnId),
        }).update({
            code,
            name,
        });

        const responseData = {
            ...iucn,
            id: iucnId.toString(),
        }

        return res.status(200).json({
            message: "Data IUCN berhasil diperbarui",
            data: responseData,
        });
    } catch (error) {
        console.error("Error saat memperbarui data IUCN:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat memperbarui data IUCN" });
    }
}

export const deleteIucn = async (req: Request, res: Response): Promise<any> => {
    try{
        const { iucnId } = req.params;

        if(!iucnId || typeof iucnId !== "string") {
            return res.status(400).json({ error: "ID IUCN wajib diisi" });
        }

        const isExist = await db.orm.public.Species.where({
            iucnStatusId: Number(iucnId),
        }).first();

        if (isExist) {
            return res.status(400).json({ error: "Data IUCN tidak dapat dihapus karena masih digunakan oleh spesies lain" });
        }

        await db.orm.public.IucnStatus.where({
            id: Number(iucnId),
        }).delete();

        return res.status(200).json({
            message: "Data IUCN berhasil dihapus",
        });
    } catch (error) {
        console.error("Error saat menghapus data IUCN:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menghapus data IUCN" });
    }
}

export const getIucn = async (req: Request, res: Response): Promise<any> => {
    try{
        const { iucnId } = req.params;

        if(!iucnId || typeof iucnId !== "string") {
            return res.status(400).json({ error: "ID IUCN wajib diisi" });
        }

        const iucn = await db.orm.public.IucnStatus.where({
            id: Number(iucnId),
        }).first();

        return res.status(200).json({
            message: "Data IUCN berhasil diambil",
            data: iucn,
        });
    } catch (error) {
        console.error("Error saat mengambil data IUCN:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data IUCN" });
    }
}

export const getAllIucn = async (req: Request, res: Response): Promise<any> => {
    try{
        const iucnList = await db.orm.public.IucnStatus.all();

        if(!iucnList || iucnList.length === 0) {
            return res.status(404).json({ error: "Data IUCN tidak ditemukan" });
        }

        return res.status(200).json({
            message: "Data IUCN berhasil diambil",
            data: iucnList,
        });
    } catch (error) {
        console.error("Error saat mengambil data IUCN:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data IUCN" });
    }
}