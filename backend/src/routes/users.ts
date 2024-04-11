import jwt from "jsonwebtoken";
import {authenticateUser} from "../middlewares/authentication";
import express, {Request as ExpressRequest, Response} from "express";
import {User} from "../models/user";


interface Request extends ExpressRequest {
  user?: {
    email: string;
  };
}

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

interface QueryError extends Error {
  code: string;
}

function isQueryError(error: unknown): error is QueryError {
  return (error as QueryError).code !== undefined;
}

router.post("/login", async (req: Request, res: Response) => {
  const email = req.body.email; // Extract email from request body
  const accessToken = jwt.sign({email}, JWT_SECRET, {expiresIn: "14d"});
  res.cookie("access-token", accessToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 14});
  res.sendStatus(204);
});


router.post("/users", async (req: Request, res: Response) => {
  const {email, password} = req.body;

  try {
    await User.create({email, password});
  } catch (error) {
    if (isQueryError(error) && error.code === "ER_DUP_ENTRY") {
      return res.status(409);
    }
    throw error;
  }
  res.sendStatus(201);
});

router.get('/users/me', authenticateUser, async (req: Request, res: Response) => {
  if (!req.user?.email) {
    return res.status(400).json({error: 'Email is required'});
  }

  const user = await User.findOne({email: req.user.email});

  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }
  res.json({email: user.email});
});

export default router;
