import User, { UserType } from '~/models/schemas/User.schema'
import { InsertOneResult, OptionalId } from 'mongodb'
import { databaseServices } from '~/services/database.services'

class UsersServices {
  async register(user: OptionalId<User>): Promise<InsertOneResult<User>> {
    return databaseServices.users.insertOne(user)
  }
}

const userServices = new UsersServices()
export default userServices
