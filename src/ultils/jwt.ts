import jwt from 'jsonwebtoken'
import { JWT_SIGN_PARAMS } from '~/contants/types'
import * as process from 'node:process'

const signToken = ({
  payload,
  privateKey = process.env.JWT_PRIVATE_KEY as string,
  options
}: JWT_SIGN_PARAMS): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, { algorithm: 'HS256', ...options }, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token as string)
      }
    })
  })
}

export { signToken }
