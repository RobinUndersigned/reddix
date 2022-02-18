import express from "express"
import client from "../db/PrismaClient"

const router = express.Router();

router.get('/', async (req, res) => {

  res.send({message: "hello world!"})
});

// get the values
router.get("/values/all", async (req, res) => {


  return false;
});

router.post("/values", async (req, res) => {
  if (!req.body.value) res.send({ working: false });



  res.send({ working: true });
});




export default router;
