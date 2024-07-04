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
import moment from "moment-timezone";

import cron from "node-cron";
import Notification from "./models/Notifications.js";
import Relationship from "./models/Relationship.js";

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

cron.schedule(
  "00 20 * * *",
  async () => {
    console.log("Running a job at 20:00 at Asia/Kolkata timezone");
    try {
      const now = moment().tz("Asia/Kolkata");
      const tomorrow = now.clone().add(1, "day");
      const tomorrowStart = tomorrow.clone().startOf("day").toDate();
      const tomorrowEnd = tomorrow.clone().endOf("day").toDate();

      await Notification.deleteMany({ type: 4 });

      const relationships = await Relationship.find({
        "importantEvents.date": { $gte: tomorrowStart, $lt: tomorrowEnd },
      });

      const notifications = [];
      relationships.forEach((relationship) => {
        relationship.importantEvents.forEach((event) => {
          if (event.date >= tomorrowStart && event.date < tomorrowEnd) {
            notifications.push({
              user: relationship.user1, // Notify user1
              message: `Reminder: You have an important event "${event.event}" scheduled for tomorrow.`,
              read: false,
              timeStamp: new Date(),
              type: 4, // Event reminders type
              relId: relationship._id,
            });
            notifications.push({
              user: relationship.user2, // Notify user2
              message: `Reminder: You have an important event "${event.event}" scheduled for tomorrow.`,
              read: false,
              timeStamp: new Date(),
              type: 4, // Event reminders type
              relId: relationship._id,
            });
          }
        });
      });

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (error) {
      console.error("Error creating notifications:", error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

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
