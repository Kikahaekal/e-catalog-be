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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use("/api/fish", fishRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/iucn", iucnRoutes);
app.use("/api/regency", regencyRoutes);
app.use("/api/wpp", wppRoutes);
app.use("/api/species", speciesRoutes)
app.use("/api/reference", referenceRoutes)


app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});