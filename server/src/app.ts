import express from "express";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from 'helmet'
import indexRouter from "./routes"
import errorHandler from "./middleware/errorHandler"
import cors from "cors"

const app = express();

app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new createError.NotFound());
});

// pass any unhandled errors to the error handler
app.use(errorHandler);

export default app;