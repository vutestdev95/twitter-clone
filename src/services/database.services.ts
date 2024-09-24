import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
dotenv.config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter2024.xm7rwop.mongodb.net/?retryWrites=true&w=majority&appName=Twitter2024`

class DatabaseServices {
  private client: MongoClient
  private db: Db
  constructor(uri: string) {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      return console.error(err)
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USER_COLLECTION ?? '')
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION ?? '')
  }
}

const databaseServices = new DatabaseServices(uri)

export { databaseServices }
