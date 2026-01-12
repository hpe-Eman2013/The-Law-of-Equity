import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import auth from "./routes/auth.js";
import modules from "./routes/modules.js";
import attempts from "./routes/attempts.js";
import libraryRoute from "./routes/library.js";
import assessments from "./routes/assessments.js"

dotenv.config();
const app = express();
// Simple logger – this will tell us if requests even hit Express
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.get("/api/ping", (_req, res) => {
  res.json({ ok: true, pong: new Date().toISOString() });
});

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req,res)=>res.json({ ok:true }));
app.use("/api/auth", auth);
app.use("/api/modules", modules);
app.use("/api/attempts", attempts);
app.use("/api", libraryRoute);
app.use("/api/assessments", assessments);

const port:number = Number(process.env.PORT) || 3000;
connectDB(process.env.MONGODB_URI!)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("⚠️ MongoDB connection failed:", err))
  .finally(() => {
    app.listen(port, "127.0.0.1", () => {
      console.log(`Server running at http://127.0.0.1:${port}`);
    });
  });
