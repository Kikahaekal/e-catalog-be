import { type Request, type Response } from "express";
import { db } from "../prisma/db.ts";
import fs from "fs";

// fungsi buat input ikan dari user
export const submitFishName = async (req: Request, res: Response): Promise<any> => {
    try{
        const { submittedName, locationNote, submitterName, photoFilePath: bodyPhotoPath} = req.body;

        if (!submittedName) {
            return res.status(400).json({ error: "Nama ikan wajib diisi" });
        }

        const photoFilePath = req.file ? req.file.path.replace(/\\/g, "/") : bodyPhotoPath;

        if (!photoFilePath) {
            return res.status(400).json({ error: "Foto ikan wajib diunggah" });
        }

        const submission = await db.orm.public.UserSubmission.create({
            submittedName,
            photoFilePath,
            locationNote: locationNote || null,
            submitterName: submitterName || null,
        })

        const responseData = {
            ...submission,
            id: submission.id.toString(),
        }

        return res.status(201).json({
            message: "Data ikan berhasil disubmit",
            data: responseData,
        });
    } catch (error) {
        console.error("Error saat menginput data ikan:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menyimpan data ikan" });
    }
}

export const getAllFishSubmissions = async (req: Request, res: Response): Promise<any> => {
    try {
        const submissions = await db.orm.public.UserSubmission.all();
        const responseData = submissions.map((submission) => ({
            ...submission,
            id: submission.id.toString(),
        }));

        return res.status(200).json({
            message: "Data permintaan berhasil diambil",
            data: responseData,
        });
    } catch (error) {
        console.error("Error saat mengambil data permintaan ikan:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data permintaan ikan" });
    }
}

//fungsi buat acc permintaan input ikan
export const approveSubmission = async (req: Request, res: Response): Promise<any> => {
    try {
        const { submissionId } = req.params;
        const { speciesId } = req.body;

        if (!speciesId || typeof submissionId !== "string") {
            return res.status(400).json({ error: "ID spesies wajib diisi" });
        }

        const submission = await db.orm.public.UserSubmission.where({
            id: BigInt(submissionId),
        }).first();

        if (!submission) {
            return res.status(404).json({ error: "Data submission tidak ditemukan" });
        }

        await db.orm.public.LocalName.create({
            speciesId: BigInt(speciesId),
            name: submission.submittedName,
            regionNote: submission.locationNote || null,
        });

        await db.orm.public.SpeciesPhoto.create({
            speciesId: BigInt(speciesId),
            filePath: submission.photoFilePath,
            caption: submission.submitterName ? `Diunggah oleh: ${submission.submitterName}` : 'Usulan Publik',
            isPrimary: false
        });

        await db.orm.public.UserSubmission.where({
            id: BigInt(submissionId),
        }).delete();

        return res.status(200).json({ message: "Submission berhasil di-approve dan data ikan telah ditambahkan" });
    } catch (error) {
        console.error("Error saat meng-approve submission:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat meng-approve submission" });
    }
}

//fungsi buat reject premintaan input ikan
export const rejectSubmission = async (req: Request, res: Response): Promise<any> => {
    try{
        const { submissionId } = req.params;

        if (!submissionId || typeof submissionId !== "string") {
            return res.status(400).json({ error: "ID submission wajib diisi" });
        }

        const submission = await db.orm.public.UserSubmission.where({
            id: BigInt(submissionId),
        }).first();

        if (!submission) {
            return res.status(404).json({ error: "Data submission tidak ditemukan" });
        }

        if (submission.photoFilePath && fs.existsSync(submission.photoFilePath)) {
            fs.unlinkSync(submission.photoFilePath);
        }

        await db.orm.public.UserSubmission.where({
            id: BigInt(submissionId),
        }).delete();

        return res.status(200).json({ message: "Submission berhasil ditolak" });
    } catch (error) {
        console.error("Error saat menolak submission:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menolak submission" });
    }
}