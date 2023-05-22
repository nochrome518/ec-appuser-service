import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { compareSync , hash} from 'bcrypt';
import { User } from 'src/protos/users/users.service';
export class AuthService {

  constructor(
    private usersService: UserService
  ){}

  async validateUser(user: User, password: string): Promise<any> {
    const isPasswordValid = await this.comparePasswords(password, user.password)
    if(!isPasswordValid){
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }


  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const comparePassword = await compareSync(password, hashedPassword);
      return comparePassword;
    } catch (e) {
      console.error('Error comparing passwords:', e);
      throw e;
    }
  }

  

}