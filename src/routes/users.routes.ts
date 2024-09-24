import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { wrapAsyncFunc } from '~/ultils/handlers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
const userRouter = Router()

userRouter.post('/login', loginValidator, wrapAsyncFunc(loginController))
userRouter.post('/register', registerValidator, wrapAsyncFunc(registerController))

export { userRouter }
