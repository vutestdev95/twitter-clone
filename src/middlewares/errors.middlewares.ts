import { ErrorWithStatus } from '~/models/Errors'
import { NextFunction, Request, Response } from 'express'
import { httpStatus } from '~/contants/httpStatus'
import { omit } from 'lodash'
export const defaultErrHandlers = (err: Error | ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ['stack'])
  })
}
