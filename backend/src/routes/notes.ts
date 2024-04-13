// import express from "express";
// import {Note} from "../models/note";
// import {authenticateUser} from "../middlewares/authentication";
//
//
// const router = express.Router();
//
//
// router.get("/", async (req, res) => {
//   const notes = await Note.findAll();
//   res.json(notes);
// });
//
// router.get("/:id", async (req, res) => {
//   const note = await Note.findOne({ id: Number(req.params.id) });
//   if (!note) {
//     return res.status(404).json({ error: "Note not found" });
//   }
//   res.json({
//     id: note.id,
//     title: note.title,
//     content: note.content,
//     createdAt: note.createdAt,
//     updatedAt: note.updatedAt
//   });
// });
//
// router.post("/", authenticateUser, async (req, res) => {
//   const { title, content } = req.body;
//   const userId = req.user?.id;
//   if (typeof userId !== "number") {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
//
//   const result = await Note.create({ title, content, userId });
//   if ("insertId" in result) {
//     res.status(201).json({id: result.insertId});
//   }
// });
//
// router.put("/:id", authenticateUser, async (req, res) => {
//   const { title, content } = req.body;
//   const id = Number(req.params.id);
//   const updatedNote = await Note.update({ id, title, content });
//   if (!updatedNote) {
//     return res.status(404).json({ error: "Note not found" });
//   }
//   res.json(updatedNote);
// });
//
// router.delete("/:id", authenticateUser, async (req, res) => {
//   const id = Number(req.params.id);
//   const result = await Note.delete({ id });
//   if (result.message === "Note not found") {
//     return res.status(404).json({ error: "Note not found" });
//   }
//   res.status(200).json({ message: "Note deleted successfully" });
// });
//
//
//
//
// export default router;

import express from "express";
import {Note} from "../models/note";
import {authenticateUser} from "../middlewares/authentication";
import {authorizeNote} from "../middlewares/authorization";

const router = express.Router();

router.get("/", async (req, res) => {
  const notes = await Note.findAll();
  res.json(notes);
});

router.get("/:id", async (req, res) => {
  const note = await Note.findOne({ id: Number(req.params.id) });
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json({
    id: note.id,
    title: note.title,
    content: note.content,
    userId: note.userId, // Add this line
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  });
});

router.post("/", authenticateUser, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user?.id;
  if (typeof userId !== "number") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const result = await Note.create({ title, content, userId });
  if ("insertId" in result) {
    res.status(201).json({id: result.insertId});
  }
});

router.put("/:id", authenticateUser, authorizeNote, async (req, res) => {
  const { title, content } = req.body;
  const id = Number(req.params.id);
  const updatedNote = await Note.update({ id, title, content });
  if (!updatedNote) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json(updatedNote);
});

router.delete("/:id", authenticateUser, authorizeNote, async (req, res) => {
  const id = Number(req.params.id);
  const result = await Note.delete({ id });
  if (result.message === "Note not found") {
    return res.status(404).json({ error: "Note not found" });
  }
  res.status(200).json({ message: "Note deleted successfully" });
});

export default router;