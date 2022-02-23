import express from "express"
import Db from "../db/PrismaClient"
import { Prisma } from '@prisma/client'
import { assert } from 'superstruct'
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import SignupValidation from "../auth/SignupValidation";
import SigninValidation from "../auth/SigninValidation";

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    assert(req.body, SignupValidation)
    console.log(req);
    const existingEmail = await Db.user.findUnique({ where: { email: req.body.email } })
    if (existingEmail) return res.status(400).send({ error: "Email already taken" })

    const existingUserName = await Db.user.findUnique({ where: { userName: req.body.userName } })
    if (existingUserName) return res.status(400).send({ error: " Username already taken" })

    if (existingUserName && existingEmail) return res.status(400).send("Email and Username taken")

    const salt = await bcrypt.genSalt(10)

    const userData: Prisma.UserCreateInput = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      userName: req.body.userName,
      password: await bcrypt.hash(req.body.password, salt)
    }

    const newUser = await Db.user.create({
      data: userData
    })

    return res.send({ id: newUser.id })

  } catch(err) {

    const { key, value, type } = err
    if (value === undefined) {
      return res.status(400).send({ error: `${key} required` })
    } else if (type === 'never') {
      return res.status(400).send({ error: `User attribute unknown` })
    } else {
      return res.status(400).send({ error: `${key} invalid` })
    }

    return res.status(500).send(err)
  }
});


router.post('/signin', async (req, res) => {
  try {
    assert(req.body, SigninValidation)

    const existingUser = await Db.user.findUnique({ where: { userName: req.body.userName } })
    if (!existingUser) return res.status(400).send({ error: "Username or password wrong" })

    const validPassword = await bcrypt.compare(req.body.password, existingUser.password)
    if (!validPassword) return res.status(400).send({ error: "Username or password wrong" })

    const tokenPayload = {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      userName: existingUser.userName,
    }

    const token = sign(tokenPayload, process.env.AUTH_SECRET);

    return res.header('auth-token', token).send({ token });
  } catch(err) {

    const { key, value, type } = err

    if (value === undefined) {
      return res.status(400).send({ error: `${key} required` })
    } else if (type === 'never') {
      return res.status(400).send()
    } else {
      return res.status(400).send({ error: `Username or password invalid` })
    }

    return res.status(500).send(err)
  }
});

export default router;
