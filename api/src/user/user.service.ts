import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserRequest } from 'src/models/requests/create-user.request';
import { UserLoginRequest } from 'src/models/requests/user-login.request';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { User, UsersServiceClient, searchUserBy } from 'src/protos/users/users.service';
import { CommonServices } from 'src/utilities/common-service';
import { Messages } from 'src/utilities/messages';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
    private userService: UsersServiceClient;

    constructor(
        @Inject('USERS_PACKAGE') private client: ClientGrpc,
        private commonFunctionService: CommonServices,
        private authService: AuthService
    ) {}
  

    onModuleInit() {
      this.userService = this.client.getService<UsersServiceClient>('UsersService');
    }

    async createUser(createUserRequest: CreateUserRequest, req: any): Promise<any> {
        const createUser: User = createUserRequest as any;
        const hashedPass = await this.authService.hashPassword(createUserRequest.password);
        createUser.password = hashedPass;
        await this.userService.createUser(createUser).toPromise()
        return this.commonFunctionService.successResponse(Messages.CREATE_USER_SUCCESS);
    }

    async userLogin(userLoginRequest: UserLoginRequest, req: any): Promise<any> {
        const searchUserBy: searchUserBy = {} as searchUserBy;
        searchUserBy.email = userLoginRequest.email;
        const userFound = await this.userService.searchUser(searchUserBy).toPromise(); 
        if(!userFound || !userFound.users){
            throw new UnauthorizedException(Messages.INVALID_USER);
        }
        let validateUser = await this.authService.validateUser(userFound.users[0], userLoginRequest.password)
        return this.commonFunctionService.successResponse(Messages.USER_LOGIN_SUCCESS);
    }

    // async searchUserByEmail(email: string): Promise<any> {
    //     const searchUserBy: searchUserBy = {} as searchUserBy;
    //     searchUserBy.email = email;
    //     const userFound = await this.userService.searchUser(searchUserBy).toPromise()  
    //     console.log("userFound :",userFound)
    //     return userFound;
    // }
}
