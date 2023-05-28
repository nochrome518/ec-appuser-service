import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { compareSync , hash} from 'bcrypt';
import { User } from 'src/protos/users/users.service';
import { JwtService } from 'src/jwt/jwt.service';
import { UserLoginResponse } from 'src/models/responses/login.response';
@Injectable()
export class AuthService {

	constructor(
		private jwtService: JwtService
	){}

	async validateUser(user: User, password: string): Promise<any> {
		const isPasswordValid = await this.comparePasswords(password, user.password)
		if(!isPasswordValid){
			throw new UnauthorizedException('Invalid credentials');
		}

		const token = await this.jwtService.generateToken(user)
		let responseData: UserLoginResponse = {} as UserLoginResponse;
		responseData.id = user.id;
		responseData.accessToken = token;
		responseData.role = user.type;
		responseData.email = user.email;
		responseData.phoneNumber = user.phoneNumber;
		responseData.cartId = user.cartId;
		return responseData;
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
			throw(`Error caught on password on validation, e:  ${e}`)
		}
	}

  

}