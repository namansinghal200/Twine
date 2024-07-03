import express from "express";
import { verifyJwtToken } from "../middleware/Verify.js";
import {
  deleteNotification,
  getAllNotifications,
  markAsRead,
  deleteAllNotifications,
  responseToRequest,
  getRequests,
} from "../controllers/Notifications.js";
const router = express.Router();

router.get("/", verifyJwtToken, getAllNotifications);
router.put("/:id", verifyJwtToken, markAsRead);
router.delete("/:id", verifyJwtToken, deleteNotification);
router.delete("/", verifyJwtToken, deleteAllNotifications);
router.post("/respond", verifyJwtToken, responseToRequest);
router.get("/requests", verifyJwtToken, getRequests);
export default router;
