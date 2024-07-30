import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
const userRouter = Router()

userRouter.post('/login', loginController)
userRouter.post('/register', registerController)

export { userRouter }
