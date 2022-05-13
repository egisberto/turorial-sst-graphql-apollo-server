import { IUserRepository } from '../repositories/userRepository' // Good!
import { User } from '../types/User'

/**
 * @class UserController
 * @desc Responsible for handling API requests for the
 * /user route.
 **/

export class UserController {
  private userRepo: IUserRepository; // like here

  constructor (userRepo: IUserRepository) { // and here
    this.userRepo = userRepo;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepo.getUsers();
    return users
  }
}