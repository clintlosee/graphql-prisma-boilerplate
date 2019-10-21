import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

const userOne = {
  input: {
    name: 'Mellissa',
    email: 'mellissa@example.com',
    password: bcrypt.hashSync('Pink1234!')
  },
  user: undefined,
  jwt: undefined
}

const userTwo = {
  input: {
    name: 'Joe',
    email: 'joe@example.com',
    password: bcrypt.hashSync('PassForJoe')
  },
  user: undefined,
  jwt: undefined
}

const seedDatabase = async () => {
  //* Delete test data
  await prisma.mutation.deleteManyUsers()

  // * Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  // * Create user two
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  })
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)
}

export { seedDatabase as default, userOne, userTwo }
