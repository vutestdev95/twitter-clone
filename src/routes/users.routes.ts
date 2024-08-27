import { Router } from 'express'
import { loginController, registerController, registerValidator } from '~/controllers/users.controllers'
const userRouter = Router()

userRouter.post('/login', loginController)
userRouter.post('/register', registerValidator, registerController)

export { userRouter }
