import { Request, Response } from 'express'
import { databaseServices } from '~/services/database.services'
import User from '~/models/schemas/User.schema'
import userServices from '~/services/users.services'
import { checkSchema, CustomValidator } from 'express-validator'
import { validate } from '~/ultils/validator-runner'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/ultils/crypto'
import { ErrorWithStatus } from '~/models/Errors'
import { USERS_MESSAGES } from '~/contants/messages'

const loginController = (req: Request, res: Response) => {
  res.status(200)
  const { username } = req.body
  if (username === 'vunguyen') {
    return res.send(`Welcome admin ${username}`)
  } else {
    return res.send(`Welcome ${username}`)
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
      message: 'User created'
    })
  } else {
    return res.status(400).send('User not created')
  }
}
/**
 * Register Validator
 * Body {
 *   name: String
 *   password: String
 *   confirm_password: String
 *   date_of_birth: ISO
 *   email: String
 * }
 **/
const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
      },
      isLength: {
        errorMessage: USERS_MESSAGES.NAME_LENGTH,
        options: {
          min: 1,
          max: 100
        }
      },
      trim: true,
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_STRING
      }
    },
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.INVALID_EMAIL
      },
      trim: true,
      custom: {
        options: async (_, { req }) => {
          const user = await userServices.findUserByEmail(req.body.email)
          if (user) {
            throw new ErrorWithStatus({ message: USERS_MESSAGES.EMAIL_EXISTS, status: 401 })
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isLength: {
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH,
        options: {
          min: 6,
          max: 50
        }
      },
      trim: true,
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING
      },
      isStrongPassword: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG,
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
      },
      isLength: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH,
        options: {
          min: 6,
          max: 50
        }
      },
      trim: true,
      isString: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING
      },
      isStrongPassword: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG,
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      },
      custom: {
        options: (value: CustomValidator, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_MATCH)
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_DATE,
        options: {
          strict: false,
          strictSeparator: true
        }
      }
    }
  })
)

export { loginController, registerController, registerValidator }
