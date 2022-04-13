import { Prisma } from '@prisma/client'
import Db from "../src/db/PrismaClient"
import { faker } from "@faker-js/faker";
import {genSalt, hash} from "bcrypt";
import axios from "axios";


function generateRange(size: number): number[] {
  return [...Array.from(Array(size).keys())];
}

async function getAvatar(): Promise<Buffer> {
  try {
    const avatar = await axios.get(faker.image.avatar(),{responseType: 'arraybuffer'});
    return Buffer.from(avatar.data)
  } catch(err) {
    console.log(err)
  }
}

/**
 * generate Users
 */
async function generateUser()  {
  const salt = await genSalt(10)
  const avatar = await getAvatar()
  const seedUser: Prisma.UserCreateInput = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: await hash("password", salt),
    Profile: {
      create: {
        bio: faker.lorem.sentence(),
        Avatar: {
          create: {
            title: "User Avatar",
            file: avatar
          }
        },
      }
    }
  }
  return seedUser;
}



/**
 * Generate Subreddix
 */
async function generateSubreddix()  {
  const word = faker.lorem.word()
  const seedUser = await generateUser()
  const seedSubreddix: Prisma.SubreddixCreateInput = {
    name: word,
    description: faker.lorem.sentence(),
    url: `r/${word.toLowerCase()}`,
    Subscribers: {
      create: [
        {
          subscribedAt: new Date(),
          User: {
            create: {
              ... seedUser
            }
          }
        }
      ]
    },
  }
  return seedSubreddix;
}

async function generatePost(seedUser: Prisma.UserCreateInput, seedSubreddix: Prisma.SubreddixCreateInput) {
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
      const subreddix = await generateSubreddix()
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
