// Request 객체의 쿠키로 주어진 jwt를 검증하고, User DAO를 Request 객체에 추가하는 미들웨어
//
// import jwt from 'jsonwebtoken';
// import {NextFunction, Request, Response} from "express";
//
// export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) {
//     return res.sendStatus(401);
//   }
//   // 정해진 이메일 주소에 대한 유효성 검증 및 디코 테스트에 활용
//
//
//   try {
//     const { email } = jwt.verify(accessToken, process.env.JWT_SECRET) as { email: string };
//
//
//     req.user = { email };
//     next();
//   } catch (error) {
//     res.sendStatus(401);
//   }
// }

// export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
//   const accessToken = req.cookies['access-token'];
//   if (!accessToken) {
//     return res.sendStatus(401);
//   }
//
//   const secret = process.env.JWT_SECRET;
//   if (!secret) {
//     console.error('JWT_SECRET is not set');
//     return res.sendStatus(500);
//   }
//
//   try {
//     const payload = jwt.verify(accessToken, secret) as JwtPayload;
//     if (payload && typeof payload.email === 'string') {
//       req.user = { email: payload.email };
//       next();
//     } else {
//       res.sendStatus(401);
//     }
//   } catch (error) {
//     res.sendStatus(401);
//   }
// }



import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";


dotenv.config();
// Request 타입을 확장하여 user 프로퍼티를 추가합니다.
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
    // console.log('No access token provided');
    return res.sendStatus(401);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // console.error('JWT_SECRET is not set');
    return res.sendStatus(500);
  }

  try {
    jwt.verify(accessToken, secret);
    const payload = jwt.decode(accessToken) as { email: string };
    if (payload && typeof payload.email === 'string') {
      req.user = { email: payload.email };
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
  }
}