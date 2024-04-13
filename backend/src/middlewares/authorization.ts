import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { Note } from "../models/note";

// export async function authenticateNote(req, res, next) {
//   const user = req.user!;
//
//   //...
//
//   req.note = note;
//   next();
// }

declare global {
  namespace Express {
    interface Request {
      note?: Note;
    }
  }
}

export async function authorizeNote(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  const note = await Note.findOne({ id });

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  if (note.userId !== req.user?.id) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  req.note = note;
  next();
}