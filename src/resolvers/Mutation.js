import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hasPassword'

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email })

    if (emailTaken) {
      throw new Error('Email taken')
    }

    const password = await hashPassword(args.data.password)

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    })

    return {
      user,
      token: generateToken(user.id)
    }
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const userExists = await prisma.query.user({ where: { id: userId } })

    if (!userExists) {
      throw new Error('User not found')
    }

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info)
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const userExists = await prisma.query.user({ where: { id: userId } })

    if (!userExists) {
      throw new Error('User not found')
    }

    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info)
  },

  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!user) {
      throw new Error(`Unable to login`); //* Be generic
    }

    const valid = await bcrypt.compare(args.data.password, user.password)

    if (!valid) {
      throw new Error(`Unable to login`) //* Be generic
    }

    return {
      user,
      token: generateToken(user.id)
    }
  }
}

export { Mutation as default }
