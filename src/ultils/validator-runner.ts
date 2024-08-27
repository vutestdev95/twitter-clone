import { ValidationChain, validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validations.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    return res.status(200).json({ errors: errors.mapped() })
  }
}

export { validate }
