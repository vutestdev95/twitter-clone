import express from 'express'
import { userRouter } from '~/routes/users.routes'
import { databaseServices } from '~/services/database.services'
import dotenv from 'dotenv'

import { defaultErrHandlers } from '~/middlewares/errors.middlewares'
dotenv.config()
const app = express()
const port = process.env.PORT ?? 3000
app.use(express.json())
app.use('/users', userRouter)
app.use(defaultErrHandlers)
app.listen(port, () => {
  console.log('server running...')
  databaseServices.connect().catch(console.error)
})
