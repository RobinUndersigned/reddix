import express from "express"
import DbClient from "../db/PrismaClient"
import authHandler from "../middleware/authHandler";
import {assert, enums, integer, object} from "superstruct";
import Db from "../db/PrismaClient";
const router = express.Router();

router.get('/', authHandler, async (req, res) => {
  try {
    const votes = await DbClient.postVote.findMany({})
    res.send(votes);
  } catch(err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
});


const VoteValidation = object({
  voteValue: enums([1, 0, -1]),
  postId: integer(),
})

router.post('/', authHandler, async (req, res) => {
  try {
    assert(req.body, VoteValidation)

    const upsertVote = await Db.postVote.upsert({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId: req.body.postId
        },
      },
      update: {
        voteValue: req.body.voteValue,
      },
      create: {
        postId: req.body.postId,
        voteValue: req.body.voteValue,
        userId: req.user.id
      },
      include: {
        Post: true
      }
    })

    return res.send(upsertVote);
  } catch(err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
});


router.get("/:voteId", authHandler, async (req, res) => {
  const voteId = parseInt(req.params.voteId, 10)
  if (isNaN(voteId)) return res.status(400).send({ error: "User not found" })

  try {
    const vote = await DbClient.postVote.findUnique({
      where: {
        id: voteId,
      },
      include: {
        User: true,
      },
    })

    if (!vote) return res.status(400).send({ error: "Vote not found" })
    return res.send(vote);

  } catch(err) {
    console.log(err);
    return res.status(err.status || 500).send(err);
  }
});




export default router;
