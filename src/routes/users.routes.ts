import { Router } from 'express'
import { loginController, registerController, registerValidator } from '~/controllers/users.controllers'
import { wrapAsyncFunc } from '~/ultils/handlers'
const userRouter = Router()

userRouter.post('/login', loginController)
userRouter.post('/register', registerValidator, wrapAsyncFunc(registerController))

export { userRouter }
