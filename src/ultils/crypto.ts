import { createHash } from 'node:crypto'

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}
function hashPassword(password: string): string {
  return sha256(password + process.env.SECRET_KEY)
}
export { hashPassword }
