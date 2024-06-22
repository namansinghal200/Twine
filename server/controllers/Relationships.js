import Relationship from "../models/Relationship.js";
import User from "../models/User.js";
import {
  format,
  startOfDay,
  endOfDay,
  differenceInHours,
  parseISO,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export const createRelationship = async (req, res, next) => {
  const { user2Username, tag } = req.body;
  const user1 = req.user.id;

  try {
    const user2 = await User.findOne({ name: user2Username }); // Make sure the field name matches your User schema
    if (!user2) return res.status(404).json({ message: "User not found" });

    // Check if the relationship already exists
    const existingRelationship = await Relationship.findOne({
      $or: [
        { user1: user1, user2: user2._id },
        { user1: user2._id, user2: user1 },
      ],
    });

    if (existingRelationship) {
      return res.status(400).json({ message: "Relationship already exists" });
    }

    const newRelationship = new Relationship({ user1, user2: user2._id, tag });
    await newRelationship.save();
    res.status(201).json(newRelationship);
  } catch (error) {
    next(error);
  }
};

// Get all relationships of a user
export const getAllRelationships = async (req, res, next) => {
  const tag = req.query?.tag;
  const userId = req.user.id;
  //console.log(req.user);
  try {
    const filter = {
      $or: [{ user1: userId }, { user2: userId }],
      ...(tag && { tag }),
    };
    const relationships = await Relationship.find(filter);
    return res.status(201).json(relationships);
  } catch (error) {
    next(error);
  }
};

// Get a specific relationship
export const getRelationship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const relationship = await Relationship.findById(id);
    return res.status(201).json({ relationship });
  } catch (error) {
    next(error);
  }
};

export const UpdateRelationship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const relationship = await Relationship.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(201).json({ relationship });
  } catch (error) {
    next(error);
  }
};

export const DeleteRelationship = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Relationship.findByIdAndDelete(id);
    return res
      .status(201)
      .json({ message: "Relationship deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const createJournalEntry = async (req, res) => {
  const { id } = req.params;
  const createdBy = req.user.id;
  const { entry } = req.body;
  const getLocalTime = () => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  };

  try {
    const relationship = await Relationship.findById(id);
    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    const newJournalEntry = {
      entry,
      createdBy,
      dateOfCreation: getLocalTime(),
    };

    relationship.journalEntries.push(newJournalEntry);
    await relationship.save();

    res.status(201).json({
      message: "Journal entry created",
      journalEntry: newJournalEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//get journal entries of the given day
export const getJournalEntriesDay = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query; // expecting a date query parameter in YYYY-MM-DD format

  try {
    const relationship = await Relationship.findById(id);
    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    // Parse the date and calculate the start and end of the day
    const startOfDayDate = startOfDay(new Date(date));
    const endOfDayDate = endOfDay(new Date(date));

    // Filter the journal entries by the date range
    const journalEntries = relationship.journalEntries.filter((entry) => {
      const entryDate = new Date(entry.dateOfCreation);
      return entryDate >= startOfDayDate && entryDate <= endOfDayDate;
    });

    res.status(200).json(journalEntries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getJournalEntriesMonth = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query; // expecting a date query parameter in YYYY-MM format

  try {
    const relationship = await Relationship.findById(id);
    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    // Parse the date and calculate the start and end of the day
    const startOfMonthDate = startOfMonth(new Date(date));
    const endOfMonthDate = endOfMonth(new Date(date));

    // Filter the journal entries by the date range
    const journalEntries = relationship.journalEntries.filter((entry) => {
      const entryDate = new Date(entry.dateOfCreation);
      return entryDate >= startOfMonthDate && entryDate <= endOfMonthDate;
    });

    res.status(200).json(journalEntries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//update Journal Entry
export const updateJournalEntry = async (req, res) => {
  const { id, entryId } = req.params;
  const userId = req.user.id;
  const { entry } = req.body;

  try {
    const relationship = await Relationship.findById(id);
    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    const journalEntry = relationship.journalEntries.id(entryId);
    if (!journalEntry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    if (journalEntry.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only edit your own entries" });
    }

    // const entryCreationDate = parseISO(journalEntry.dateOfCreation);
    // console.log(entryCreationDate);
    if (differenceInHours(new Date(), journalEntry.dateOfCreation) > 24) {
      return res.status(400).json({
        message:
          "Unauthorized: You can only edit entries within 24 hours of creation",
      });
    }

    journalEntry.entry = entry;
    await relationship.save();

    res.status(200).json({ message: "Journal entry updated", journalEntry });
  } catch (error) {
    console.log("Error updating journal entry:", error); // Log the error details
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteJournalEntry = async (req, res) => {
  const { id, entryId } = req.params;
  const userId = req.user.id;

  try {
    const relationship = await Relationship.findById(id);
    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    const journalEntry = relationship.journalEntries.id(entryId);
    if (!journalEntry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    if (journalEntry.createdBy.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete your own entries",
      });
    }

    if (differenceInHours(new Date(), journalEntry.dateOfCreation) > 24) {
      return res.status(400).json({
        message:
          "Unauthorized: You can only delete entries within 24 hours of creation",
      });
    }
    //console.log(journalEntry);
    relationship.journalEntries = relationship.journalEntries.filter(
      (entry) => entry.id !== entryId
    );
    await relationship.save();

    res.status(200).json({ message: "Journal entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
