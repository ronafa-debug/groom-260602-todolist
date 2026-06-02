import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { dataRouter } from "./routes/data.js";
import "./db.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? [
      "http://localhost:5156",
      "http://127.0.0.1:5156",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/data", dataRouter);

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
