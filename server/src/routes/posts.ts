import express from "express"
import DbClient from "../db/PrismaClient"
import authHandler from "../middleware/authHandler";

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
      include: {
        Subreddix: true,
        Votes: true
      }
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
      }
    })

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
    console.log(err);
    return res.status(err.status || 500).send(err);
  }
});

// Sanitize HTML
// https://github.com/apostrophecms/sanitize-html
router.post("/", authHandler, async (req, res) => {
  const postId= parseInt(req.params.postId, 10)
  if (isNaN(postId)) return res.status(400).send({ error: "User not found" })

  try {
    const post = await DbClient.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        Votes: true,
      },
    })

    if (!post) return res.status(400).send({ error: "Post not found" })
    const userVote = post.Votes.find((vote) => vote.userId === req.user.id)
    return res.send({
      ...post,
      userHasVoted: userVote ? true : false,
      userVote: userVote ? userVote : null,
      userVoteValue: userVote ? userVote.voteValue : null,
      votesTotal: post.Votes.reduce((acc: number, obj: Vote) => {
        return acc + obj.voteValue
      }, 0)
    })

  } catch(err) {
    console.log(err);
    return res.status(err.status || 500).send(err);
  }
});




export default router;
