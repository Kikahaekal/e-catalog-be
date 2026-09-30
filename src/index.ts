import express , { type Request, type Response } from "express";
import fishRoutes from "./routes/fishRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import iucnRoutes from "./routes/iucnRoutes.ts";
import regencyRoutes from "./routes/regencyRoutes.ts";
import wppRoutes from "./routes/wppRoutes.ts";
import speciesRoutes from "./routes/speciesRoutes.ts";
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/fish", fishRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/iucn", iucnRoutes);
app.use("/api/regency", regencyRoutes);
app.use("/api/wpp", wppRoutes);
app.use("/api/species", speciesRoutes)


app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});