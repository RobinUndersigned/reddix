import express from "express"
import Db from "../db/PrismaClient"
import { Prisma } from '@prisma/client'
import {assert, object, optional, size, string} from 'superstruct'
import authHandler from "../middleware/authHandler";
import DbClient from "../db/PrismaClient";

const router = express.Router();

const SubreddixValidation = object(
  {
    name: size(string(), 1, 50),
    description: optional(size(string(), 1, 350))
  }
);

router.post('/', authHandler, async (req, res) => {
  try {
    assert(req.body, SubreddixValidation)

    const name = req.body.name.replace(/ /g, "").trim()
    const existingSubreddix = await Db.subreddix.findUnique({ where: { name } })
    if (existingSubreddix) return res.status(400).send("Name already taken")

    const subreddixData: Prisma.SubreddixCreateInput = {
      name,
      url: name.toLowerCase(),
      description: req.body.description,
    }

    const newSubreddix = await Db.subreddix.create({
      data: subreddixData
    })

    return res.send({ ...newSubreddix })

  } catch(err) {

    const { key, value, type } = err
    if (value === undefined) {
      return res.status(400).send({ error: `${key} required` })
    } else if (type === 'never') {
      return res.status(400).send({ error: `Subreddix attribute unknown` })
    } else {
      return res.status(400).send({ error: `${key} invalid` })
    }

    return res.status(500).send(err)
  }
});


router.get('/', authHandler, async (req, res) => {
  try {
    const subreddixs = await DbClient.subreddix.findMany()
    return res.send(subreddixs);
  } catch(err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
});

router.get('/:subreddixUrl', authHandler, async (req, res) => {
  const subreddixUrl = req.params.subreddixUrl.toString();

  try {
    const subreddix = await DbClient.subreddix.findUnique({
      where: {
        url: subreddixUrl,
      },
      include: {
        Posts: true,
      },
    })

    if (!subreddix) return res.status(400).send({ error: "Subreddix not found" })
    return res.send({ ...subreddix });

  } catch(err) {
    console.log(err);
    return res.status(err.status || 500).send(err);
  }
});

export default router;
