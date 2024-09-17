import { ValidationChain, validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { EntityErrors, ErrorWithStatus } from '~/models/Errors'
import { httpStatus } from '~/contants/httpStatus'

const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validations.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const mappedErrors = errors.mapped()
    console.log(mappedErrors)
    const entityError = new EntityErrors({ errors: {} })
    for (const keys in mappedErrors) {
      const { msg } = mappedErrors[keys]
      if (msg instanceof ErrorWithStatus && msg.status !== httpStatus.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[keys] = mappedErrors[keys]
    }
    next(entityError)
  }
}

export { validate }
