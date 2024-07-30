import { Request, Response } from 'express'
import { databaseServices } from '~/services/database.services'
import User from '~/models/schemas/User.schema'
import userServices from '~/services/users.services'

const loginController = (req: Request, res: Response) => {
  res.status(200)
  const { username } = req.body
  if (username === 'vunguyen') {
    return res.send(`Welcome admin ${username}`)
  } else {
    return res.send(`Welcome ${username}`)
  }
}

const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await userServices.register(
      new User({
        email,
        password
      })
    )
    if (result.acknowledged) {
      const userCreated = await databaseServices.users.findOne({
        _id: result.insertedId
      })
      return res.status(201).send(userCreated)
    } else {
      return res.status(400).send('User not created')
    }
  } catch (err) {
    return res.status(400).send(err)
  }
}

export { loginController, registerController }
