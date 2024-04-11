// Request 객체의 쿠키로 주어진 jwt 를 검증하고, User DAO 를 Request 객체에 추가하는 미들웨어
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
// import dotenv from "dotenv";
//
//
// dotenv.config();
// Request 타입을 확장하여 user 프로퍼티를 추가
declare global {
  namespace Express {
    interface Request {
      user?: { email: string };
    }
  }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies['access-token'];
  if (!accessToken) {
    return res.sendStatus(401);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.sendStatus(500);
  }

  try {
    jwt.verify(accessToken, secret);
    const payload = jwt.decode(accessToken) as { email: string };
    if (payload) {
      req.user = { email: payload.email };
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
  }
}