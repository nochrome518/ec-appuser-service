import { UserService } from '../user/user.service'

export class AuthService {

    constructor(
        private usersService: UserService
    ){}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.searchUser(username);
        if (user && user.password === password) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
}