## Getting Started
This is the backend code for reddix. In includes an ExpressJs (TS) API with JWT authentication.
it uses Postgresql as the database layer and [Prisma IO](https://www.prisma.io/) for ORM. is being used.

### Install dependencies
```
npm install
```

### Setup .env file
Create .env File and add DATABASE_URL according to the prisma documentation to it.
Also make sure to add an AUTH_SECRET for JWT to work.

Here is an example:
```
AUTH_SECRET="E7CF478D061D51D11B63DE22EE97DDBD9E81C77CB2B9EECE42B028B48CDD254C"
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

### Seeding the database
In order to seed the database run:
```
npx prisma db seed
```
This will run the seed.ts file in the prisma directory and for now create 10 testusers.


### Running in development
```
npm run dev
```

### Running in production

```
npm start
```

Runs on localhost:5000 by default but can be configured using the `PORT` environment variable.

### Running tests
```
npm test

# Watch repo
npm run test:watch
```

### Linting
```
npm run lint

# fix issues
npm run lint:fix
```
