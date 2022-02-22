import { Prisma } from '@prisma/client'
import Db from "../src/db/PrismaClient"
import { faker } from "@faker-js/faker";

function generateRange(size: number): number[] {
  return [...Array.from(Array(size).keys())];
}

async function createUser()  {
  const seedUser: Prisma.UserCreateInput = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: `${faker.name.firstName()+faker.name.lastName()}`,
    email: faker.name.firstName(),
    password: "password"
  }
  try {
    const newUser = await Db.user.create({
      data: seedUser,
    })
    console.log(`Created user with id: ${newUser.id}`)
  } catch(err) {
    console.log(err)
  }
}

async function main() {
  console.log(`Start seeding ...`)
  generateRange(10).map((v) => {
    createUser()
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