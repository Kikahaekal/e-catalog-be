import { type Request, type Response } from "express";
import { db } from "../prisma/db.ts";

export const createRegency = async (req: Request, res: Response): Promise<any> => {
    try{
        const { name, province } = req.body;

        if(!name || !province) {
            return res.status(400).json({ error: "Nama dan provinsi wajib diisi" });
        }

        const regency = await db.orm.public.Regency.create({
            name,
            province,
        });

        const responseData = {
            ...regency,
            id: regency.id.toString(),
        }

        return res.status(201).json({
            message: "Data kabupaten/kota berhasil dibuat",
            data: responseData,
        });
    } catch (error) {
        console.error("Error saat membuat data kabupaten/kota:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menyimpan data kabupaten/kota" });
    }
}

export const editRegency = async (req: Request, res: Response): Promise<any> => {
    try{
        const { regencyId } = req.params;
        const { name, province } = req.body;

        if(!regencyId || typeof regencyId !== "string") {
            return res.status(400).json({ error: "ID kabupaten/kota wajib diisi" });
        }

        if(!name || !province) {
            return res.status(400).json({ error: "Nama dan provinsi wajib diisi" });
        }

        const regency = await db.orm.public.Regency.where({
            id: Number(regencyId),
        }).update({
            name,
            province,
        });

        const responseData = {
            ...regency,
            id: regencyId.toString(),
        }

        return res.status(200).json({
            message: "Data kabupaten/kota berhasil diperbarui",
            data: responseData,
        });
    } catch (error) {
        console.error("Error saat memperbarui data kabupaten/kota:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat memperbarui data kabupaten/kota" });
    }
}

export const deleteRegency = async (req: Request, res: Response): Promise<any> => {
    try{
        const { regencyId } = req.params;

        if(!regencyId || typeof regencyId !== "string") {
            return res.status(400).json({ error: "ID kabupaten/kota wajib diisi" });
        }

        await db.orm.public.Regency.where({
            id: Number(regencyId),
        }).delete();

        return res.status(200).json({
            message: "Data kabupaten/kota berhasil dihapus",
        });
    } catch (error) {
        console.error("Error saat menghapus data kabupaten/kota:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menghapus data kabupaten/kota" });
    }
}

export const getRegencies = async (req: Request, res: Response): Promise<any> => {
    try{
        const { regencyId } = req.params;

        if(!regencyId || typeof regencyId !== "string") {
            return res.status(400).json({ error: "ID kabupaten/kota wajib diisi" });
        }

        const regency = await db.orm.public.Regency.where({
            id: Number(regencyId)
        }).first();

        return res.status(200).json({
            message: "Data Berhasil Diambil",
            data: regency
        })
    } catch (error) {
        console.error("Error saat mengambil data kabupaten/kota:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data kabupaten/kota" });
    }
}

export const getAllRegencies = async (req: Request, res: Response): Promise<any> => {
    try{
        const regencies = await db.orm.public.Regency.all();

        if(!regencies) {
            return res.status(404).json({
                error: "Data Provinsi/Kota/Kabupaten Tidak ada",
            })
        }

        return res.status(200).json({
            message: "Data berhasil ditemukan",
            data: regencies
        })
    } catch (error) {
        console.error("Error saat mengambil data kabupaten/kota:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data kabupaten/kota" });
    }
}