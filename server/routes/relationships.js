import express from "express";
import {
  getRelationship,
  getAllRelationships,
  createRelationship,
  UpdateRelationship,
  DeleteRelationship,
  createJournalEntry,
  getJournalEntriesDay,
  getJournalEntriesMonth,
  updateJournalEntry,
  deleteJournalEntry,
  createImportantEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/Relationships.js";
import { verifyJwtToken } from "../middleware/Verify.js";
const router = express.Router();

router.get("/", verifyJwtToken, getAllRelationships);
router.post("/create", verifyJwtToken, createRelationship);
router.get("/:id", verifyJwtToken, getRelationship);
router.put("/:id", verifyJwtToken, UpdateRelationship);
router.delete("/:id", verifyJwtToken, DeleteRelationship);
router.post("/:id/createJournal", verifyJwtToken, createJournalEntry);
router.get("/:id/journalOnDate", verifyJwtToken, getJournalEntriesDay);
router.get("/:id/journalOnMonth", verifyJwtToken, getJournalEntriesMonth);
router.put("/:id/journalEntries/:entryId", verifyJwtToken, updateJournalEntry);
router.delete(
  "/:id/journalEntries/:entryId",
  verifyJwtToken,
  deleteJournalEntry
);
router.get("/:id/events", verifyJwtToken, getAllEvents);
router.post("/:id/newEvent", verifyJwtToken, createImportantEvent);
router.put("/:id/event/:eventId", verifyJwtToken, updateEvent);
router.delete("/:id/event/:eventId", verifyJwtToken, deleteEvent);
export default router;
