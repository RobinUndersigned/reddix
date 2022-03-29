import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function authHandler(req: Request, res: Response, next: NextFunction)  {
  const token = req.header('auth-token')
  if (!token) return res.status(401).send("Access denied!")

  try {
    const verified = jwt.verify(token, process.env.AUTH_SECRET)
    req.user = verified as Express.User
    next()
  } catch (err) {
    return res.status(400).send({ error: "Invalid Token!" })
  }
}

export default authHandler;