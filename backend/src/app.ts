import express, {NextFunction, Request, Response} from "express";
import "express-async-errors";
import { CORS_ALLOWED_ORIGIN } from "./settings";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from './routes/users';
import dotenv from 'dotenv';
dotenv.config();

const app = express();


app.use(
    cors({
      origin: CORS_ALLOWED_ORIGIN,
      credentials: true,
    })
);


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use('/', userRouter);


app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.sendStatus(500);
});

export { app };