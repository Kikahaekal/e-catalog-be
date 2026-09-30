import { type Request, type Response } from "express";
import { db } from "../prisma/db.ts";

export const createSpecies = async (req: Request, res: Response): Promise<any> => {
    try {
        const { iucnStatusId, commonName, scientificName, wppIds, regencyIds } = req.body;

        if(!iucnStatusId || !commonName || !scientificName) {
            return res.status(400).json({error: "Data nama dan status iucn perlu diisi"})
        }

        const species = await db.orm.public.Species.create({
            iucnStatusId: iucnStatusId,
            commonName: commonName,
            scientificName: scientificName,
            ...(regencyIds && regencyIds.length > 0 && {
                regencies: (r) => r.connect(
                    regencyIds.map((id: number) => ({id}))
                )
            }),
            ...(wppIds && wppIds.length > 0 && {
                wppZones: (wpp) => wpp.connect(
                    wppIds.map((id: number) => ({id}))
                )
            })
        });

        if(!species) {
            return res.status(400).json({error: "Data spesies gagal ditambahkan"});
        }

        const responseData = {
            ...species
        }

        return res.status(200).json({
            message: "Data spesies berhasil di input",
            data: responseData
        });
    } catch (error) {
        console.error("Error saat membuat data spesies:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menyimpan data spesies" });
    }
}

export const editSpecies = async (req: Request, res: Response): Promise <any> => {
    try {
        const { speciesId } = req.params;
        const { iucnStatusId, commonName, scientificName, wppIds, regencyIds } = req.body;

        if(!speciesId || typeof speciesId !== "string") {
            return res.status(400).json({error: "Id spesies wajib ada"});
        }

        if(!iucnStatusId || !commonName || !scientificName) {
            return res.status(400).json({error: "Data nama dan status iucn perlu diisi"})
        }

        const species = await db.orm.public.Species.where({
            id: BigInt(speciesId)  
        }).update({
            iucnStatusId: iucnStatusId,
            commonName: commonName,
            scientificName: scientificName,
            ...(regencyIds && regencyIds.length > 0 && {
                regencies: (r) => r.connect(
                    regencyIds.map((id: number) => ({id}))
                )
            }),
            ...(wppIds && wppIds.length > 0 && {
                wppZones: (wpp) => wpp.connect(
                    wppIds.map((id: number) => ({id}))
                )
            })
        });

        if(!species) return res.status(400).json({error: "Data gagal diubah"});

        const responseData = {
            ...species
        };

        return res.status(200).json({
            message: "Data berhasil diubah",
            data: responseData
        });
    } catch (error) {
        console.error("Error saat mengubah data spesies:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menyimpan data spesies" });
    }
}

export const deletesSpecies = async (req: Request, res: Response): Promise<any> => {
    try{
        const { speciesId } = req.params;

        if(!speciesId || typeof speciesId !== "string") {
            return res.status(400).json({error: "Id spesies wajib ada"})
        }

        const spesies = await db.orm.public.Species.where({
            id: BigInt(speciesId)
        }).delete();

        if(!spesies) return res.status(400).json({error: "Data gagal dihapus"});

        return res.status(200).json({
            message: "Data berhasil dihapus"
        });
    } catch(error) {
        console.error("Error saat menghapus spesies: ", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menghapus data spesies" });
    }
}

export const getSpecies = async (res: Response, req: Request): Promise<any> => {
    try{
        const { speciesId } = req.params;
        
        if(!speciesId || typeof speciesId !== "string") {
            return res.status(400).json({error: "Id spesies wajib ada"});
        }

        const species = await db.orm.public.Species.where({
            id: BigInt(speciesId)
        }).include("photos").include("localNames")
        .include(
            "regencies", (speciesRegency) => 
                speciesRegency.include("regency", (regency) => 
                    regency.select("name", "province").orderBy((r) => r.name.asc())
                )
        ).include(
            "wppZones", (speciesWpp) =>
                speciesWpp.include("wppZone", (wppZone) => 
                    wppZone.select("code", "description").orderBy((wpp) => wpp.code.asc())
                )
        ).first();

        if(!species) return res.status(404).json({error: "Data tidak ditemukan"});

        return res.status(200).json({
            message: "Data spesies berhasil diambil",
            data: species
        });
    } catch (error) {
        console.error("Error saat mengambil data spesies: ", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data spesies" });
    }
}

export const getAllSpecies = async (res: Response, req: Request): Promise<any> => {
    try{
        const species = await db.orm.public.Species
        .include("photos").include("localNames")
        .include(
            "regencies", (speciesRegency) => 
                speciesRegency.include("regency", (regency) => 
                    regency.select("name", "province").orderBy((r) => r.name.asc())
                )
        ).include(
            "wppZones", (speciesWpp) =>
                speciesWpp.include("wppZone", (wppZone) => 
                    wppZone.select("code", "description").orderBy((wpp) => wpp.code.asc())
                )
        ).all();

        if(!species) return res.status(404).json({error: "Data tidak ditemukan"});

        return res.status(200).json({
            message: "Data spesies berhasil diambil",
            data: species
        });

    } catch (error) {
        console.error("Error saat mengambil data spesies: ", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data spesies" });
    }
}