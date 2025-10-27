import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import auth from "./routes/auth.js";
import modules from "./routes/modules.js";
import attempts from "./routes/attempts.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", auth);
app.use("/api/modules", modules);
app.use("/api/attempts", attempts);
const port = process.env.PORT || 8080;
connectDB(process.env.MONGODB_URI).then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
});
