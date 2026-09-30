import { type Request, type Response } from "express";
import { db } from "../prisma/db.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req: Request, res: Response): Promise<any> => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email dan password wajib diisi" });
        }

        const user = await db.orm.public.User.where({ email }).first();
        if (!user) {
            return res.status(401).json({ error: "Email atau password salah" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Email atau password salah" });
        }
        
        const token = jwt.sign({ userId: user.id.toString() }, JWT_SECRET!, { expiresIn: "1h" });

        return res.status(200).json({
            message: "Login berhasil",
            token,
        });
    } catch (error) {
        console.error("Error saat login:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat login" });
    }
}