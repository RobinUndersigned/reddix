import express from "express"
import DbClient from "../db/PrismaClient"
import authHandler from "../middleware/authHandler";

const router = express.Router();

router.get('/', authHandler, async (req, res) => {
  try {
    const posts = await DbClient.post.findMany({
      include: {
        Subreddix: true,
        Votes: true,
      }
    })
    res.send(posts);
  } catch(err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
});


router.get("/:postId", authHandler, async (req, res) => {
  const userId= parseInt(req.params.postId, 10)
  if (isNaN(userId)) return res.status(400).send({ error: "User not found" })

  try {
    const user = await DbClient.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Posts: true,
      },
    })

    if (!user) return res.status(400).send({ error: "User not found" })
    const { id, firstName, lastName, email, userName, Posts, role } = user;
    return res.send({ id, firstName, lastName, email, userName, Posts, role });

  } catch(err) {
    console.log(err);
    return res.status(err.status || 500).send(err);
  }
});




export default router;
