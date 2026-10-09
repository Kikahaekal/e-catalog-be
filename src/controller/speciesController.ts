import { type Request, type Response } from "express";
import { Temporal } from "temporal-polyfill";
import { db } from "../prisma/db.ts";

const parseOptionalTemporalInstant = (value: unknown): Temporal.Instant | undefined => {
    if (value === null || value === undefined || value === "") return undefined;

    const date = new Date(value as string);
    if (Number.isNaN(date.getTime())) return undefined;

    return Temporal.Instant.from(date.toISOString());
};

const parseOptionalNumber = (value: unknown): number | undefined => {
    if (value === null || value === undefined || value === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};

const parseOptionalBoolean = (value: unknown): boolean | undefined => {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return Boolean(value);
};

const serializeSpeciesResponse = <T>(value: T): T =>
    JSON.parse(JSON.stringify(value, (_key, nestedValue) =>
        typeof nestedValue === "bigint" ? nestedValue.toString() : nestedValue
    ));

const createSpeciesRelations = async (speciesId: bigint, payload: {
    synonyms?: Array<{ scientificName: string; author?: string | null; status?: string | null; }>;
    localNames?: Array<{ name: string; regionNote?: string | null; }>;
    photos?: Array<{ filePath: string; caption?: string | null; isPrimary?: boolean; }>;
    references?: Array<{ referenceId: number; isMainRef?: boolean; }>;
    regencyIds?: number[];
    wppIds?: number[];
}): Promise<void> => {
    const speciesIdNumber = speciesId.toString();

    if (payload.synonyms?.length) {
        await Promise.all(payload.synonyms.map((synonym) =>
            db.orm.public.Synonym.create({
                speciesId: BigInt(speciesIdNumber),
                scientificName: synonym.scientificName,
                author: synonym.author || null,
                status: synonym.status || null,
            })
        ));
    }

    if (payload.localNames?.length) {
        await Promise.all(payload.localNames.map((localName) =>
            db.orm.public.LocalName.create({
                speciesId: BigInt(speciesIdNumber),
                name: localName.name,
                regionNote: localName.regionNote || null,
            })
        ));
    }

    if (payload.photos?.length) {
        await Promise.all(payload.photos.map((photo) =>
            db.orm.public.SpeciesPhoto.create({
                speciesId: BigInt(speciesIdNumber),
                filePath: photo.filePath,
                caption: photo.caption || null,
                isPrimary: photo.isPrimary ?? false,
            })
        ));
    }

    if (payload.references?.length) {
        await Promise.all(payload.references.map((reference) =>
            db.orm.public.SpeciesReference.create({
                speciesId: BigInt(speciesIdNumber),
                referenceId: BigInt(reference.referenceId),
                isMainRef: reference.isMainRef ?? false,
            })
        ));
    }

    if (payload.regencyIds?.length) {
        await Promise.all(payload.regencyIds.map((regencyId) =>
            db.orm.public.SpeciesRegency.create({
                speciesId: BigInt(speciesIdNumber),
                regencyId,
            })
        ));
    }

    if (payload.wppIds?.length) {
        await Promise.all(payload.wppIds.map((wppId) =>
            db.orm.public.SpeciesWppZone.create({
                speciesId: BigInt(speciesIdNumber),
                wppZoneId: wppId,
            })
        ));
    }
};

const replaceSpeciesRelations = async (speciesId: bigint, payload: {
    synonyms?: Array<{ scientificName: string; author?: string | null; status?: string | null; }>;
    localNames?: Array<{ name: string; regionNote?: string | null; }>;
    photos?: Array<{ filePath: string; caption?: string | null; isPrimary?: boolean; }>;
    references?: Array<{ referenceId: number; isMainRef?: boolean; }>;
    regencyIds?: number[];
    wppIds?: number[];
}): Promise<void> => {
    const existingSynonyms = await db.orm.public.Synonym.where({ speciesId }).all();
    await Promise.all(existingSynonyms.map((synonym) =>
        db.orm.public.Synonym.where({ id: synonym.id }).delete()
    ));

    const existingLocalNames = await db.orm.public.LocalName.where({ speciesId }).all();
    await Promise.all(existingLocalNames.map((localName) =>
        db.orm.public.LocalName.where({ id: localName.id }).delete()
    ));

    const existingPhotos = await db.orm.public.SpeciesPhoto.where({ speciesId }).all();
    await Promise.all(existingPhotos.map((photo) =>
        db.orm.public.SpeciesPhoto.where({ id: photo.id }).delete()
    ));

    const existingReferences = await db.orm.public.SpeciesReference.where({ speciesId }).all();
    await Promise.all(existingReferences.map((reference) =>
        db.orm.public.SpeciesReference.where({
            speciesId,
            referenceId: reference.referenceId,
        }).delete()
    ));

    const existingRegencies = await db.orm.public.SpeciesRegency.where({ speciesId }).all();
    await Promise.all(existingRegencies.map((regency) =>
        db.orm.public.SpeciesRegency.where({
            speciesId,
            regencyId: regency.regencyId,
        }).delete()
    ));

    const existingWppZones = await db.orm.public.SpeciesWppZone.where({ speciesId }).all();
    await Promise.all(existingWppZones.map((wppZone) =>
        db.orm.public.SpeciesWppZone.where({
            speciesId,
            wppZoneId: wppZone.wppZoneId,
        }).delete()
    ));

    await createSpeciesRelations(speciesId, payload);
};

export const createSpecies = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
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
            iucnStatusId,
            iucnAssessedAt,
            citesStatus,
            cmsStatus,
            synonyms,
            localNames,
            photos,
            references,
            wppIds,
            regencyIds,
        } = req.body;

        if(!commonName || !scientificName) {
            return res.status(400).json({error: "Nama umum dan nama ilmiah perlu diisi"})
        }

        const species = await db.orm.public.Species.create({
            commonName: commonName,
            scientificName: scientificName,
            author: author || null,
            etymology: etymology || null,
            order: order || null,
            family: family || null,
            genus: genus || null,
            environment: environment || null,
            climateZone: climateZone || null,
            depthMinMeters: parseOptionalNumber(depthMinMeters),
            depthMaxMeters: parseOptionalNumber(depthMaxMeters),
            tempMinC: parseOptionalNumber(tempMinC),
            tempMaxC: parseOptionalNumber(tempMaxC),
            distributionText: distributionText || null,
            maxLengthCm: parseOptionalNumber(maxLengthCm),
            lengthType: lengthType || null,
            maxWeightKg: parseOptionalNumber(maxWeightKg),
            maxAgeYears: parseOptionalNumber(maxAgeYears),
            dorsalSpines: dorsalSpines || null,
            dorsalSoftRays: dorsalSoftRays || null,
            analSpines: analSpines || null,
            analSoftRays: analSoftRays || null,
            bodyShape: bodyShape || null,
            morphologyText: morphologyText || null,
            biologyText: biologyText || null,
            fecundityText: fecundityText || null,
            threatToHumans: threatToHumans || null,
            fisheriesImportance: fisheriesImportance || null,
            isGamefish: parseOptionalBoolean(isGamefish) ?? false,
            iucnStatusId: iucnStatusId ? Number(iucnStatusId) : null,
            iucnAssessedAt: parseOptionalTemporalInstant(iucnAssessedAt),
            citesStatus: citesStatus || null,
            cmsStatus: cmsStatus || null,
        });

        if(!species) {
            return res.status(400).json({error: "Data spesies gagal ditambahkan"});
        }

        await createSpeciesRelations(species.id, {
            synonyms,
            localNames,
            photos,
            references,
            regencyIds,
            wppIds,
        });

        const responseData = serializeSpeciesResponse({
            ...species,
        });

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
        const {
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
            iucnStatusId,
            iucnAssessedAt,
            citesStatus,
            cmsStatus,
            synonyms,
            localNames,
            photos,
            references,
            wppIds,
            regencyIds,
        } = req.body;

        if(!speciesId || typeof speciesId !== "string") {
            return res.status(400).json({error: "Id spesies wajib ada"});
        }

        if(!commonName || !scientificName) {
            return res.status(400).json({error: "Nama umum dan nama ilmiah perlu diisi"})
        }

        const speciesIdBigInt = BigInt(speciesId);
        const species = await db.orm.public.Species.where({
            id: speciesIdBigInt
        }).update({
            commonName: commonName,
            scientificName: scientificName,
            author: author || null,
            etymology: etymology || null,
            order: order || null,
            family: family || null,
            genus: genus || null,
            environment: environment || null,
            climateZone: climateZone || null,
            depthMinMeters: parseOptionalNumber(depthMinMeters),
            depthMaxMeters: parseOptionalNumber(depthMaxMeters),
            tempMinC: parseOptionalNumber(tempMinC),
            tempMaxC: parseOptionalNumber(tempMaxC),
            distributionText: distributionText || null,
            maxLengthCm: parseOptionalNumber(maxLengthCm),
            lengthType: lengthType || null,
            maxWeightKg: parseOptionalNumber(maxWeightKg),
            maxAgeYears: parseOptionalNumber(maxAgeYears),
            dorsalSpines: dorsalSpines || null,
            dorsalSoftRays: dorsalSoftRays || null,
            analSpines: analSpines || null,
            analSoftRays: analSoftRays || null,
            bodyShape: bodyShape || null,
            morphologyText: morphologyText || null,
            biologyText: biologyText || null,
            fecundityText: fecundityText || null,
            threatToHumans: threatToHumans || null,
            fisheriesImportance: fisheriesImportance || null,
            isGamefish: parseOptionalBoolean(isGamefish) ?? false,
            iucnStatusId: iucnStatusId ? Number(iucnStatusId) : null,
            iucnAssessedAt: parseOptionalTemporalInstant(iucnAssessedAt),
            citesStatus: citesStatus || null,
            cmsStatus: cmsStatus || null,
        });

        if(!species) return res.status(400).json({error: "Data gagal diubah"});

        await replaceSpeciesRelations(speciesIdBigInt, {
            synonyms,
            localNames,
            photos,
            references,
            regencyIds,
            wppIds,
        });

        const responseData = serializeSpeciesResponse({
            ...species,
        });

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

export const getSpecies = async (req: Request, res: Response): Promise<any> => {
    try{
        const { speciesId } = req.params;
        
        if(!speciesId || typeof speciesId !== "string") {
            return res.status(400).json({error: "Id spesies wajib ada"});
        }

        const species = await db.orm.public.Species.where({
            id: BigInt(speciesId)
        }).include("photos").include("localNames").include("synonyms").include("iucnStatus", (iucnStatus) =>
            iucnStatus.select("id", "code", "name")
        )
        .include(
            "references", (speciesReference) =>
                speciesReference.include("reference", (reference) =>
                    reference.select("id", "refCode", "authors", "year", "title", "source")
                )
        ).include(
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
            data: serializeSpeciesResponse(species)
        });
    } catch (error) {
        console.error("Error saat mengambil data spesies: ", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data spesies" });
    }
}

export const getAllSpecies = async (req: Request, res: Response): Promise<any> => {
    try{
        const species = await db.orm.public.Species
        .include("photos").include("localNames").include("synonyms").include("iucnStatus", (iucnStatus) =>
            iucnStatus.select("id", "code", "name")
        )
        .include(
            "references", (speciesReference) =>
                speciesReference.include("reference", (reference) =>
                    reference.select("id", "refCode", "authors", "year", "title", "source")
                )
        ).include(
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
            data: serializeSpeciesResponse(species)
        });

    } catch (error) {
        console.error("Error saat mengambil data spesies: ", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data spesies" });
    }
}