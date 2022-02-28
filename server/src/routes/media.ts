import express from "express"
import DbClient from "../db/PrismaClient"
import authHandler from "../middleware/authHandler";

const router = express.Router();

router.get('/', authHandler, async (req, res) => {
  try {
    const files = await DbClient.media.findMany()
    res.send(files);
  } catch(err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
});


router.get("/:mediaId", authHandler, async (req, res) => {
  const mediaId= parseInt(req.params.mediaId, 10)
  if (isNaN(mediaId)) return res.status(400).send({ error: "User not found" })

  try {
    const media = await DbClient.media.findUnique({
      where: {
        id: mediaId,
      },
    })

    if (!media) return res.status(400).send({ error: "File not found" })
    const {id, title, type, file} = media
    const base64 = "data:image/jpg;base64," + file.toString('base64')
    return res.send({
      id, title, type,
      file: base64
    });

  } catch(err) {
    console.log(err);
    return res.status(err.status || 500).send(err);
  }
});




export default router;
