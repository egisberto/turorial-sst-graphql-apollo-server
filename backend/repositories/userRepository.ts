import { User } from '../types/User'
import { connectToDatabase } from './mongodb'

export interface IUserRepository {
  getUsers(): Promise<User[]>
  getUser(user: User): Promise<User> | null
}

class UserRepository implements IUserRepository {
  async getUsers(): Promise<User[]> {
    const db = await connectToDatabase();

    const usersData = (await db.collection("users").find({}).toArray()) as User[];
    return usersData;
  }

  async getUser(user: User): Promise<User> {
    const db = await connectToDatabase();

    const userData = (db.collection("users").findOne(user)) as User;
    return userData;
  }
}