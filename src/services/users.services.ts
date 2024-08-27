import User from '~/models/schemas/User.schema'
import { InsertOneResult, OptionalId, WithId } from 'mongodb'
import { databaseServices } from '~/services/database.services'

class UsersServices {
  async register(user: OptionalId<User>): Promise<InsertOneResult<User>> {
    return databaseServices.users.insertOne(user)
  }
  async findUserByEmail(email: string): Promise<WithId<User> | null> {
    return databaseServices.users.findOne({
      email
    })
  }
}

const userServices = new UsersServices()
export default userServices
