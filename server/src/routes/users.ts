import express from "express"
import DbClient from "../db/PrismaClient"
import authHandler from "../middleware/authHandler";

const router = express.Router();

router.get('/', authHandler, async (req, res) => {
  try {
    const users = await DbClient.user.findMany()
    res.send(users);
  } catch(err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
});


router.get("/:userId", authHandler, async (req, res) => {
  const id = parseInt(req.params.userId, 10)
  if (isNaN(id)) return res.status(400).send({ error: "User not found" })

  try {
    const user = await DbClient.user.findUnique({
      where: {
        id,
      },
      include: {
        Posts: true,
      },
    })

    if (!user) return res.status(400).send({ error: "User not found" })
    return res.send({ user });

  } catch(err) {
    console.log(err);
    return res.status(err.status || 500).send(err);
  }
});




export default router;
