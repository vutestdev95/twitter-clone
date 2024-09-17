import { ErrorWithStatus } from '~/models/Errors'
import { NextFunction, Request, Response } from 'express'
import { httpStatus } from '~/contants/httpStatus'

export const defaultErrHandlers = (err: Error | ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  return res
    .status(err instanceof ErrorWithStatus && err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR)
    .json(err)
}
