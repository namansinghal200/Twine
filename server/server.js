import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
//import connectDB from "./config/db.js";
import userRoutes from "./routes/auth.js";
import relationshipRoutes from "./routes/relationships.js";
import notificationRoutes from "./routes/notifications.js";

import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Connect Database
//connectDB();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// Serve static files for avatars
app.use(
  `/public/avatars`,
  express.static(path.join(__dirname, "public", "avatars"))
);

app.get("/public/avatars", (req, res) => {
  const avatarsDir = path.join(__dirname, "public", "avatars");
  fs.readdir(avatarsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to fetch avatars" });
    }
    res.json({ avatars: files });
  });
});

// Routes
app.use("/auth", userRoutes);
app.use("/relationships", relationshipRoutes);
app.use("/notifications", notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json(message);
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
