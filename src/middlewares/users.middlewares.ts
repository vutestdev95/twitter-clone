import { NextFunction, Request, Response } from 'express'

const handleLoginValidation = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }
  next()
}

export { handleLoginValidation }
