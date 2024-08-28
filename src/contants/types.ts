import jwt from 'jsonwebtoken'
interface JWT_PAYLOAD {
  userId: string
  token_type: string
}
interface JWT_SIGN_PARAMS {
  payload: JWT_PAYLOAD
  privateKey?: jwt.Secret
  options?: jwt.SignOptions
}

enum JWT_TOKEN_TYPES {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  FORGOT_PASSWORD_TOKEN = 'forgot_password_token',
  EMAIL_VERIFY_TOKEN = 'email_verify_token'
}

export { JWT_SIGN_PARAMS, JWT_TOKEN_TYPES }
