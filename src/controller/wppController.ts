import { type Request, type Response } from "express";
import { db } from "../prisma/db.ts";

export const createWpp = async (req: Request, res: Response): Promise<any> => {
    try{
        const { code, description } = req.body;

        if(!code || !description ) {
            return res.status(400).json({
                error: "Kode dan Deskripsi harus diisi"
            });
        }

        const wpp = await db.orm.public.WppZone.create({
            code,
            description
        });

        const responseData = {
            ...wpp,
            id: wpp.id.toString()
        }

        return res.status(200).json({
            message: "Data berhasil ditambah",
            data: responseData,
        });
    } catch (error) {
        console.error("Error saat menginput data wpp:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menyimpan data wpp" });
    }
}

export const editWpp = async (req: Request, res: Response): Promise<any> => {
    try {
        const { wppId } = req.params;
        const { code, description } = req.body;

        if(!wppId || typeof wppId !== "string") {
            return res.status(400).json({ error: "ID wajib ada" })
        }

        if(!code || !description) {
            return res.status(400).json({ error: "Kode dan deskripsi wajib diisi" });
        }

        const wpp = await db.orm.public.WppZone.where({
            id: Number(wppId)
        }).update({ code, description });

        return res.status(200).json({
            message: "Data berhasil diperbarui",
            data: wpp,
        })
    } catch (error) {
        console.error("Error saat memperbarui data:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat memperbarui data" });
    }
}

export const deleteWpp = async (req: Request, res: Response): Promise<any> => {
    try{
        const { wppId } = req.params;

        if(!wppId || typeof wppId !== "string") {
            return res.status(400).json({error: "id wajib ada"})
        }

        await db.orm.public.WppZone.where({
            id: Number(wppId)
        }).delete();

        return res.status(200).json({
            message: "Data berhasil dihapus"
        });
    } catch (error) {
        console.error("Error saat menghapus", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menghapus data" });
    }
}

export const getWpp = async (req: Request, res: Response): Promise<any> => {
    try{
        const { wppId } = req.params;

        if(!wppId || typeof wppId !== "string") {
            return res.status(400).json({error: "id wajib ada"});
        }

        const wpp = await db.orm.public.WppZone.where({
            id: Number(wppId)
        }).first();

        return res.status(200).json({
            message: "Data berhasil diambil",
            data: wpp
        });
    } catch (error) {
        console.error("Error saat mengambil data:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data" });
    }
}

export const getAllWpp = async (req: Request, res: Response): Promise<any> => {
    try {
        const wpps = await db.orm.public.WppZone.all();

        if(!wpps || wpps.length === 0) {
            return res.status(404).json({ error: "Data wpp tidak ditemukan" });
        }

        return res.status(200).json({
            message: "Data berhasil diambil",
            data: wpps,
        });
    } catch (error) {
        console.error("Error saat mengambil data:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data" });
    }
}