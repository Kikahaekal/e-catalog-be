import express , { type Request, type Response } from "express";
import dotenv from "dotenv";
import fishRoutes from "./routes/fishRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import iucnRoutes from "./routes/iucnRoutes.ts";
import regencyRoutes from "./routes/regencyRoutes.ts";
import wppRoutes from "./routes/wppRoutes.ts";
import speciesRoutes from "./routes/speciesRoutes.ts";
import referenceRoutes from "./routes/referenceRoutes.ts";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec, swaggerUiOptions } from "./swagger.ts";
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define __dirname for ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use("/api/fish", fishRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/iucn", iucnRoutes);
app.use("/api/regency", regencyRoutes);
app.use("/api/wpp", wppRoutes);
app.use("/api/species", speciesRoutes);
app.use("/api/reference", referenceRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[FATAL] Port ${PORT} sedang digunakan oleh proses lain!`);
  } else {
    console.error("[FATAL] Server error:", err);
  }
});