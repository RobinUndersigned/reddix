import { Prisma } from '@prisma/client'
import Db from "../src/db/PrismaClient"
import { faker } from "@faker-js/faker";
import {genSalt, hash} from "bcrypt";

function generateRange(size: number): number[] {
  return [...Array.from(Array(size).keys())];
}

/**
 * generate Users
 */

async function generateUser()  {
  const salt = await genSalt(10)
  const seedUser: Prisma.UserCreateInput = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: `${faker.name.firstName()+faker.name.lastName()}`,
    email: faker.internet.email(),
    password: await hash("password", salt)
  }
  return seedUser;
}

/**
 * Generate Subreddix
 */
function generateSubreddix()  {
  const word = faker.lorem.word()
  const seedSubreddix: Prisma.SubreddixCreateInput = {
    name: word,
    description: faker.lorem.sentence(),
    url: word.toLowerCase(),
  }
  return seedSubreddix;
}

function generatePost(seedUser: Prisma.UserCreateInput, seedSubreddix: Prisma.SubreddixCreateInput) {
  const seedPost: Prisma.PostCreateInput = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    published: Math.random() > 0.5 ? true : false,
    User: {
      create: seedUser
    },
    Subreddix: {
      create: seedSubreddix
    }
  }
  return seedPost
}

async function main() {
  console.log(`Start seeding ...`)
  const posts = await Promise.all(
    generateRange(10).map(async (v) => {
      const user = await generateUser()
      const subreddix = generateSubreddix()
      const post = await generatePost(user, subreddix)
      return post;
    })
  )

  posts.map(async (post) => {
    try {
      const newPost = await Db.post.create({ data: post})
      console.log("---------------------------")
      console.log(`Created Post with id ${newPost.id} \n User with ID ${newPost.authorId} \n  and Subreddix with ID ${newPost.subreddixId}`)
      console.log("---------------------------")
    } catch(err) {
      console.log(err)
    }
  })
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await Db.$disconnect()
  })