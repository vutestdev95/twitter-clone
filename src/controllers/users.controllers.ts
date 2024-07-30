import { Request, Response } from 'express'

const loginController = (req: Request, res: Response) => {
  res.status(200)
  const { username } = req.body
  if (username === 'vunguyen') {
    return res.send(`Welcome admin ${username}`)
  } else {
    return res.send(`Welcome ${username}`)
  }
}

export { loginController }
