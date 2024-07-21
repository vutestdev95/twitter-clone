import { Router } from 'express'
import { handleLoginValidation } from '~/middlewares/users.middlewares'
import { loginController } from '~/controllers/users.controllers'
const userRouter = Router()

userRouter.post('/login', handleLoginValidation, loginController)

export { userRouter }
