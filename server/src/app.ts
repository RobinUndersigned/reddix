import express from "express";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from 'helmet'
import indexRouter from "./routes"
import usersRouter from "./routes/users"
import authRouter from "./routes/auth"
import subreddixRouter from "./routes/subreddix";
import postsRouter from "./routes/posts";
import mediaRouter from "./routes/media";
import votesRouter from "./routes/votes";
import errorHandler from "./middleware/errorHandler"
import cors from "cors"
import dotenv from "dotenv"

export interface AuthUserProfile {
  id: number,
  bio: string,
  avatarId: number,
}

declare global {
  namespace Express {
    interface User {
      id: number,
      firstName: string,
      lastName: string,
      userName: string,
      email: string;
      Profile: AuthUserProfile
    }
  }
}
dotenv.config();

const app = express();
app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/r', subreddixRouter);
app.use('/posts', postsRouter);
app.use('/media', mediaRouter);
app.use('/votes', votesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new createError.NotFound());
});

// pass any unhandled errors to the error handler
app.use(errorHandler);

export default app;
