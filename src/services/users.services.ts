import User from '~/models/schemas/User.schema'
import { ObjectId, OptionalId, WithId } from 'mongodb'
import { databaseServices } from '~/services/database.services'
import { signToken } from '~/ultils/jwt'
import { JWT_TOKEN_TYPES } from '~/contants/types'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

class UsersServices {
  private signAccessToken(userId: string): Promise<string> {
    return signToken({
      payload: {
        userId,
        token_type: JWT_TOKEN_TYPES.ACCESS_TOKEN
      },
      options: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
      }
    })
  }
  private signRefreshToken(userId: string): Promise<string> {
    return signToken({
      payload: {
        userId,
        token_type: JWT_TOKEN_TYPES.REFRESH_TOKEN
      },
      options: {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES
      }
    })
  }
  private async signRefreshTokenAndAccessToken(userId: string) {
    return Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
  }
  async register(user: OptionalId<User>) {
    const result = await databaseServices.users.insertOne(user)
    const userId = result.insertedId.toString()
    const [accessToken, refreshToken] = await this.signRefreshTokenAndAccessToken(userId)
    await databaseServices.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(userId), token: refreshToken })
    )
    return { accessToken, refreshToken, acknowledged: result.acknowledged }
  }
  async findUserByEmail({ email }: { email: string }): Promise<WithId<User> | null> {
    return databaseServices.users.findOne({
      email
    })
  }
  async login(userId: string) {
    const [accessToken, refreshToken] = await this.signRefreshTokenAndAccessToken(userId)
    return {
      accessToken,
      refreshToken,
      status: 'ok'
    }
  }
}

const userServices = new UsersServices()
export default userServices
