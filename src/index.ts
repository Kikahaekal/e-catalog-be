import dotenv from 'dotenv';
import express , { type Request, type Response } from "express";
import fishRoutes from "./routes/fishRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import iucnRoutes from "./routes/iucnRoutes.ts";
import regencyRoutes from "./routes/regencyRoutes.ts";
import wppRoutes from "./routes/wppRoutes.ts";
import speciesRoutes from "./routes/speciesRoutes.ts";
import referenceRoutes from "./routes/referenceRoutes.ts";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerUiOptions } from './swagger.ts';
// import { db } from './prisma/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173', // Mengizinkan domain frontend Vite Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use("/api/fish", fishRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/iucn", iucnRoutes);
app.use("/api/regency", regencyRoutes);
app.use("/api/wpp", wppRoutes);
app.use("/api/species", speciesRoutes);
app.use("/api/reference", referenceRoutes);

// async function main() {
//     try {
//         if (typeof db.connect === 'function') {
//             await db.connect();
//         }

//         app.listen(3000, () => {
//             console.log('Server berjalan di http://localhost:3000');
//         });
//     } catch (error) {
//         console.error('Gagal terhubung ke database:', error);
//         process.exit(1);
//     }
// }

// main();


app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});