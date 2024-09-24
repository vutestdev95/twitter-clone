import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import userServices from '~/services/users.services'

import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/ultils/crypto'
import { WithId } from 'mongodb'
import { USERS_MESSAGES } from '~/contants/messages'

const loginController = async (req: Request, res: Response) => {
  const { user } = req
  const { _id } = user as WithId<User>
  const userId = _id.toString()
  const result = await userServices.login(userId)
  if (result.status === 'ok') {
    return res.status(200).json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      message: USERS_MESSAGES.LOGIN_SUCCESS
    })
  } else {
    return res.status(400).send({ message: USERS_MESSAGES.LOGIN_FAILED })
  }
}

const registerController = async (
  req: Request<NonNullable<unknown>, NonNullable<unknown>, RegisterReqBody>,
  res: Response
) => {
  const payload = req.body
  const result = await userServices.register(
    new User({
      ...payload,
      date_of_birth: new Date(payload.date_of_birth),
      password: hashPassword(payload.password),
      confirm_password: hashPassword(payload.confirm_password)
    })
  )
  if (result.acknowledged) {
    return res.status(201).json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      message: USERS_MESSAGES.USER_CREATED
    })
  } else {
    return res.status(400).send({
      message: USERS_MESSAGES.USER_NOT_CREATED
    })
  }
}

export { loginController, registerController }
