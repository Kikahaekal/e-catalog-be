import { type Request, type Response } from "express";
import { db } from "../prisma/db.ts";

const serializeBigInt = (obj: any) => {
    return JSON.parse(
        JSON.stringify(obj, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
};

export const createSpecies = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            iucnStatusId, commonName, scientificName, author, etymology, order, family, genus,
            environment, climateZone, depthMinMeters, depthMaxMeters, tempMinC, tempMaxC,
            distributionText, maxLengthCm, lengthType, maxWeightKg, maxAgeYears, dorsalSpines,
            dorsalSoftRays, analSpines, analSoftRays, bodyShape, morphologyText, biologyText,
            fecundityText, threatToHumans, fisheriesImportance, isGamefish, iucnAssessedAt,
            citesStatus, cmsStatus, wppIds, regencyIds, synonyms, references
        } = req.body;

        if(!commonName || !scientificName) {
            return res.status(400).json({error: "Nama umum dan nama ilmiah wajib diisi"})
        }
        if (synonyms !== undefined && (!Array.isArray(synonyms) || synonyms.some((synonym) => !synonym.scientificName))) {
            return res.status(400).json({ error: "Format sinonim tidak valid" });
        }
        if (references !== undefined && (!Array.isArray(references) || references.some((reference) => !Number.isInteger(Number(reference.referenceId)) || Number(reference.referenceId) <= 0))) {
            return res.status(400).json({ error: "Format referensi spesies tidak valid" });
        }

        const species = await db.orm.public.Species.create({
            iucnStatusId: iucnStatusId ?? null,
            commonName,
            scientificName,
            author,
            etymology,
            order,
            family,
            genus,
            environment,
            climateZone,
            depthMinMeters,
            depthMaxMeters,
            tempMinC,
            tempMaxC,
            distributionText,
            maxLengthCm,
            lengthType,
            maxWeightKg,
            maxAgeYears,
            dorsalSpines,
            dorsalSoftRays,
            analSpines,
            analSoftRays,
            bodyShape,
            morphologyText,
            biologyText,
            fecundityText,
            threatToHumans,
            fisheriesImportance,
            isGamefish: isGamefish ?? false,
            iucnAssessedAt: iucnAssessedAt ? new Date(iucnAssessedAt) : null,
            citesStatus,
            cmsStatus,
            ...(regencyIds && regencyIds.length > 0 && {
                regencies: (r) => r.create(
                    regencyIds.map((id: number) => ({regencyId: id}))
                )
            }),
            ...(wppIds && wppIds.length > 0 && {
                wppZones: (wpp) => wpp.create(
                    wppIds.map((id: number) => ({wppZoneId: id}))
                )
            })
        });

        if(!species) {
            return res.status(400).json({error: "Data spesies gagal ditambahkan"});
        }

        if (synonyms?.length) {
            await Promise.all(synonyms.map((synonym: any) => db.orm.public.Synonym.create({
                speciesId: species.id,
                scientificName: synonym.scientificName,
                author: synonym.author ?? null,
                status: synonym.status ?? null,
            })));
        }
        if (references?.length) {
            await Promise.all(references.map((reference: any) => db.orm.public.SpeciesReference.create({
                speciesId: species.id,
                referenceId: BigInt(reference.referenceId),
                isMainRef: reference.isMainRef ?? false,
            })));
        }

        const responseData = {
            ...species
        }

        return res.status(200).json({
            message: "Data spesies berhasil di input",
            data: serializeBigInt(responseData)
        });
    } catch (error) {
        console.error("Error saat membuat data spesies:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menyimpan data spesies" });
    }
}

export const editSpecies = async (req: Request, res: Response): Promise <any> => {
    try {
        const { speciesId } = req.params;
        const {
            iucnStatusId, commonName, scientificName, author, etymology, order, family, genus,
            environment, climateZone, depthMinMeters, depthMaxMeters, tempMinC, tempMaxC,
            distributionText, maxLengthCm, lengthType, maxWeightKg, maxAgeYears, dorsalSpines,
            dorsalSoftRays, analSpines, analSoftRays, bodyShape, morphologyText, biologyText,
            fecundityText, threatToHumans, fisheriesImportance, isGamefish, iucnAssessedAt,
            citesStatus, cmsStatus, wppIds, regencyIds, synonyms, references
        } = req.body;

        if(!speciesId || typeof speciesId !== "string") {
            return res.status(400).json({error: "Id spesies wajib ada"});
        }

        if(!commonName || !scientificName) {
            return res.status(400).json({error: "Nama umum dan nama ilmiah wajib diisi"})
        }
        if (synonyms !== undefined && (!Array.isArray(synonyms) || synonyms.some((synonym) => !synonym.scientificName))) {
            return res.status(400).json({ error: "Format sinonim tidak valid" });
        }
        if (references !== undefined && (!Array.isArray(references) || references.some((reference) => !Number.isInteger(Number(reference.referenceId)) || Number(reference.referenceId) <= 0))) {
            return res.status(400).json({ error: "Format referensi spesies tidak valid" });
        }

        const parsedSpeciesId = BigInt(speciesId);
        const existingSpecies = await db.orm.public.Species.where({ id: parsedSpeciesId }).first();
        if (!existingSpecies) {
            return res.status(404).json({ error: "Data spesies tidak ditemukan" });
        }


        if (regencyIds && Array.isArray(regencyIds)) {
            await db.orm.public.SpeciesRegency.where({ speciesId: parsedSpeciesId }).delete();
        }

        if (wppIds && Array.isArray(wppIds)) {
            await db.orm.public.SpeciesWppZone.where({ speciesId: parsedSpeciesId }).delete();
        }
        if (synonyms !== undefined) {
            await db.orm.public.Synonym.where({ speciesId: parsedSpeciesId }).delete();
        }
        if (references !== undefined) {
            await db.orm.public.SpeciesReference.where({ speciesId: parsedSpeciesId }).delete();
        }

        const species = await db.orm.public.Species.where({
            id: BigInt(parsedSpeciesId)  
        }).update({
            iucnStatusId: iucnStatusId === undefined ? undefined : iucnStatusId,
            commonName,
            scientificName,
            author,
            etymology,
            order,
            family,
            genus,
            environment,
            climateZone,
            depthMinMeters,
            depthMaxMeters,
            tempMinC,
            tempMaxC,
            distributionText,
            maxLengthCm,
            lengthType,
            maxWeightKg,
            maxAgeYears,
            dorsalSpines,
            dorsalSoftRays,
            analSpines,
            analSoftRays,
            bodyShape,
            morphologyText,
            biologyText,
            fecundityText,
            threatToHumans,
            fisheriesImportance,
            isGamefish,
            iucnAssessedAt: iucnAssessedAt === undefined ? undefined : iucnAssessedAt ? new Date(iucnAssessedAt) : null,
            citesStatus,
            cmsStatus,
            ...(regencyIds && regencyIds.length > 0 && {
                regencies: (r) => r.create(
                    regencyIds.map((id: number) => ({regencyId: id}))
                )
            }),
            ...(wppIds && wppIds.length > 0 && {
                wppZones: (wpp) => wpp.create(
                    wppIds.map((id: number) => ({wppZoneId: id}))
                )
            })
        });

        if (synonyms?.length) {
            await Promise.all(synonyms.map((synonym: any) => db.orm.public.Synonym.create({
                speciesId: parsedSpeciesId,
                scientificName: synonym.scientificName,
                author: synonym.author ?? null,
                status: synonym.status ?? null,
            })));
        }
        if (references?.length) {
            await Promise.all(references.map((reference: any) => db.orm.public.SpeciesReference.create({
                speciesId: parsedSpeciesId,
                referenceId: BigInt(reference.referenceId),
                isMainRef: reference.isMainRef ?? false,
            })));
        }

        if(!species) return res.status(400).json({error: "Data gagal diubah"});

        const responseData = {
            ...species
        };

        return res.status(200).json({
            message: "Data berhasil diubah",
            data: serializeBigInt(responseData)
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

        const parsedSpeciesId = BigInt(speciesId);

        await db.orm.public.SpeciesRegency.where({ speciesId: parsedSpeciesId }).delete();
        await db.orm.public.SpeciesWppZone.where({ speciesId: parsedSpeciesId }).delete();
        await db.orm.public.LocalName.where({ speciesId: parsedSpeciesId }).delete();
        await db.orm.public.SpeciesPhoto.where({ speciesId: parsedSpeciesId }).delete();

        const spesies = await db.orm.public.Species.where({
            id: parsedSpeciesId
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

export const getSpecies = async (req: Request, res: Response): Promise<any> => {
    try{
        const { speciesId } = req.params;
        
        if(!speciesId || typeof speciesId !== "string") {
            return res.status(400).json({error: "Id spesies wajib ada"});
        }

        const species = await db.orm.public.Species.where({
            id: BigInt(speciesId)
        }).include("iucnStatus").include("synonyms").include("photos").include("localNames")
        .include(
            "references", (speciesReference) =>
                speciesReference.include("reference")
        )
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
            data: serializeBigInt(species)
        });
    } catch (error) {
        console.error("Error saat mengambil data spesies: ", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data spesies" });
    }
}

export const getAllSpecies = async (req: Request, res: Response): Promise<any> => {
    try{
        const { name } = req.query;
        const searchName = typeof name === "string" ? name.trim().toLocaleLowerCase() : "";

        const allSpecies = await db.orm.public.Species
        .include("iucnStatus").include("synonyms").include("photos").include("localNames")
        .include(
            "references", (speciesReference) =>
                speciesReference.include("reference")
        )
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

        const species = searchName
            ? allSpecies.filter((item) =>
                [item.commonName, item.scientificName, ...item.localNames.map((localName) => localName.name)]
                    .some((itemName) => itemName.toLocaleLowerCase().includes(searchName))
            )
            : allSpecies;

        if(!species) return res.status(404).json({error: "Data tidak ditemukan"});

        return res.status(200).json({
            message: "Data spesies berhasil diambil",
            data: serializeBigInt(species)
        });

    } catch (error) {
        console.error("Error saat mengambil data spesies: ", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data spesies" });
    }
}