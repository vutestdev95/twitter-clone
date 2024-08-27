import { Request, Response } from 'express'
import { databaseServices } from '~/services/database.services'
import User from '~/models/schemas/User.schema'
import userServices from '~/services/users.services'
import { checkSchema, CustomValidator } from 'express-validator'
import { validate } from '~/ultils/validator-runner'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/ultils/crypto'

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
  try {
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
  } catch (err) {
    return res.status(400).send(err)
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
        errorMessage: 'Name is required'
      },
      isLength: {
        errorMessage: 'Name must be between 1 and 100 characters',
        options: {
          min: 1,
          max: 100
        }
      },
      trim: true,
      isString: {
        errorMessage: 'Name must be a string'
      }
    },
    email: {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Invalid email'
      },
      trim: true,
      custom: {
        options: async (_, { req }) => {
          const user = await userServices.findUserByEmail(req.body.email)
          if (user) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: 'Password is required'
      },
      isLength: {
        errorMessage: 'Password must be between 6 and 50 characters',
        options: {
          min: 6,
          max: 50
        }
      },
      trim: true,
      isString: true,
      isStrongPassword: {
        errorMessage: 'Password must be strong',
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
      notEmpty: true,
      isLength: {
        errorMessage: 'Password must be between 6 and 50 characters',
        options: {
          min: 6,
          max: 50
        }
      },
      trim: true,
      isString: true,
      isStrongPassword: {
        errorMessage: 'Password must be strong',
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
            throw new Error('Password confirmation does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        errorMessage: 'Invalid date',
        options: {
          strict: false,
          strictSeparator: true
        }
      }
    }
  })
)

export { loginController, registerController, registerValidator }
