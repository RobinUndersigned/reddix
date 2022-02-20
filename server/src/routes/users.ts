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
  try {
    const user = await DbClient.user.findUnique({
      where: {
        id,
      },
      include: {
        Posts: true,
      },
    })

    res.send(user);
  } catch(err) {
    res.status(err.status || 500).send(err);
    console.log(err);
  }

});




export default router;
