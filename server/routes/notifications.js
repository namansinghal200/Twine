import express from "express";
import { verifyJwtToken } from "../middleware/Verify.js";
import {
  deleteNotification,
  getAllNotifications,
  markAsRead,
  deleteAllNotifications,
} from "../controllers/Notifications.js";
const router = express.Router();

router.get("/", verifyJwtToken, getAllNotifications);
router.put("/:id", verifyJwtToken, markAsRead);
router.delete("/:id", verifyJwtToken, deleteNotification);
router.delete("/", verifyJwtToken, deleteAllNotifications);
export default router;
