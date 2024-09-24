import { validate } from '~/ultils/validator-runner'
import { checkSchema, CustomValidator } from 'express-validator'
import { USERS_MESSAGES } from '~/contants/messages'
import userServices from '~/services/users.services'
import { ErrorWithStatus } from '~/models/Errors'
import { databaseServices } from '~/services/database.services'
import { hashPassword } from '~/ultils/crypto'

//** Login Validator
// Body {
//   email: String,
//   password: String
// }
const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.INVALID_EMAIL
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseServices.users.findOne({ email: value, password: hashPassword(req.body.password) })
          if (!user) {
            throw new ErrorWithStatus({ message: USERS_MESSAGES.EMAIL_OR_PASSWORD_NOT_CORRECT, status: 404 })
          }
          req.user = user
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
    }
  })
)
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
          const user = await userServices.findUserByEmail({ email: req.body.email })
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

export { loginValidator, registerValidator }
