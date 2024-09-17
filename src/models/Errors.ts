import { httpStatus } from '~/contants/httpStatus'
import { USERS_MESSAGES } from '~/contants/messages'

type ErrorTypes = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>
export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityErrors extends ErrorWithStatus {
  errors: ErrorTypes
  constructor({ message = USERS_MESSAGES.VALIDATION_ERRORS, errors }: { message?: string; errors: ErrorTypes }) {
    super({ message, status: httpStatus.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
