import express from "express"
import DbClient from "../db/PrismaClient"
import authHandler from "../middleware/authHandler";
import {assert, boolean, number, object,  size, string} from "superstruct";


const router = express.Router();
type VoteValue = -1 | 0 | 1
interface Vote {
  id: number,
  userId: number,
  postId: number,
  createdAt: Date,
  voteValue: VoteValue
}

router.get('/', authHandler, async (req, res) => {
  try {
    const posts = await DbClient.post.findMany({
      where: {
        published: true
      },
      include: {
        Subreddix: true,
        Votes: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const result = posts.map((post) => {
    const userVote = post.Votes.find((vote) => vote.userId === req.user.id)
    return {
      id: post.id,
      title: post.title,
      createdAt: post.createdAt,
      content: post.content,
      published: post.published,
      authorId: post.authorId,
      subreddixId: post.subreddixId,
      Subreddix: post.Subreddix,
      userHasVoted: userVote ? true : false,
      userVote: userVote ? userVote : null,
      userVoteValue: userVote ? userVote.voteValue : null,
      votesTotal: post.Votes.reduce((acc: number, obj: Vote) => {
        return acc + obj.voteValue
      }, 0)
    }})

    res.send(result);
  } catch(err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
});


router.get("/:postId", authHandler, async (req, res) => {
  const postId= parseInt(req.params.postId, 10)
  if (isNaN(postId)) return res.status(400).send({ error: "User not found" })

  try {
    const post = await DbClient.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        Subreddix: true,
        Votes: true,
      },
    })

    if (!post) return res.status(400).send({ error: "Post not found" })
    const userVote = post.Votes.find((vote) => vote.userId === req.user.id)
    return res.send({
      id: post.id,
      title: post.title,
      createdAt: post.createdAt,
      content: post.content,
      published: post.published,
      authorId: post.authorId,
      subreddixId: post.subreddixId,
      Subreddix: post.Subreddix,
      userHasVoted: userVote ? true : false,
      userVote: userVote ? userVote : null,
      userVoteValue: userVote ? userVote.voteValue : null,
      votesTotal: post.Votes.reduce((acc: number, obj: Vote) => {
        return acc + obj.voteValue
      }, 0)
    })

  } catch(err) {
    return res.status(err.status || 500).send(err);
  }
});

// Sanitize HTML
// https://github.com/apostrophecms/sanitize-html

const PostValidation = object({
  title: size(string(), 1, 500),
  content: string(),
  authorId: number(),
  published: boolean(),
  subreddixId: number(),
})

router.post("/", authHandler, async (req, res) => {
  try {
    const subreddixId = req.body.subreddixId
      ? () => {
        return parseInt(req.body.subreddixId, 10)
      }
      : async () => {
        const subreddix = await DbClient.subreddix.findFirst({ where: { url: req.body.url }})
        return subreddix.id
      };

    const postBody = {
      title: req.body.title,
      content: req.body.content,
      authorId: req.user.id,
      published: req.body.published,
      subreddixId: await subreddixId()
    }

    assert(postBody, PostValidation)

    const newPost = await DbClient.post.create({
      data: {
        ...postBody,
        Votes: {
          create: {
            userId: req.user.id,
            voteValue: 1
          }
        }
      },
      include: {
        Votes: true,
        Subreddix: true
      },
    })

    const userVote = newPost.Votes.find((vote) => vote.userId === req.user.id)
    return res.send({
      id: newPost.id,
      title: newPost.title,
      createdAt: newPost.createdAt,
      content: newPost.content,
      published: newPost.published,
      authorId: newPost.authorId,
      subreddixId: newPost.subreddixId,
      Subreddix: newPost.Subreddix,
      userHasVoted: userVote ? true : false,
      userVote: userVote ? userVote : null,
      userVoteValue: userVote ? userVote.voteValue : null,
      votesTotal: newPost.Votes.reduce((acc: number, obj: Vote) => {
        return acc + obj.voteValue
      }, 0)
    })

  } catch(err) {
    console.log(err);
    const { key, value, type } = err

    console.log({key, value, type})
    if (value === undefined) {
      return res.status(400).send({ error: `${key} required` })
    } else if (type === 'never') {
      return res.status(400).send({ error: `Post attribute unknown` })
    } else {
      return res.status(400).send({error: `${key} invalid`})
    }

    return res.status(err.status || 500).send(err);
  }
});




export default router;
