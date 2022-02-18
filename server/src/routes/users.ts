import express from "express"
import DbClient from "../db/PrismaClient"

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await DbClient.user.findMany()
    res.send(users);
  } catch(err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
});


router.get("/:userId", async (req, res) => {
 const id = parseInt(req.params.userId, 10)
  try {
    console.log(req.params);
    const user = await DbClient.user.findUnique({
      where: {
        id,
      },
    })

    console.log(user);
    res.send(user);
  } catch(err) {
    res.status(err.status || 500).send(err);
    console.log(err);
  }

});




export default router;
