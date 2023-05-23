import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserRequest } from 'src/models/requests/create-user.request';
import { UserLoginRequest } from 'src/models/requests/user-login.request';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { User, UsersServiceClient, searchUserBy } from 'src/protos/users/users.service';
import { CommonServices } from 'src/utilities/common-service';
import { Messages } from 'src/constants/messages';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserRequest } from 'src/models/requests/update-user.request';
import { v4 as uuidv4 } from 'uuid';
import { AuthUser } from 'src/models/auth.user';


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

    generateUID(): string {
        return uuidv4();
    }

    async createUser(createUserRequest: CreateUserRequest): Promise<any> {
        const createUser: User = createUserRequest as any;
        const hashedPass = await this.authService.hashPassword(createUserRequest.password);
        createUser.password = hashedPass;
        createUser.uid = this.generateUID(); 
        await this.userService.createUser(createUser).toPromise()
        return this.commonFunctionService.successResponse(Messages.USER_CREATED);
    }

    async userLogin(userLoginRequest: UserLoginRequest): Promise<any> {
        const searchUserBy: searchUserBy = {} as searchUserBy;
        searchUserBy.email = userLoginRequest.email;
        const userFound = await this.userService.searchUser(searchUserBy).toPromise(); 
        if(!userFound || !userFound.users){
            throw new UnauthorizedException(Messages.INVALID_USER_EMAIL);
        }

        const authResponse = await this.authService.validateUser(userFound.users[0], userLoginRequest.password)
        return this.commonFunctionService.successResponseWithData(Messages.TOKEN_GENERATE,authResponse);
    }

    async searchUserById(id: number): Promise<any> {
        const searchUserBy: searchUserBy = {} as searchUserBy;
        searchUserBy.id = id;
        const userFound = await this.userService.searchUser(searchUserBy).toPromise()  
        return userFound;
    }

    async updateUserById(updateUserRequest: UpdateUserRequest, id: number, user: AuthUser): Promise<any> {
        const searchUserBy: searchUserBy = {} as searchUserBy;
        searchUserBy.id = id;
        const userFound = await this.userService.searchUser(searchUserBy).toPromise(); 
        if(!userFound || !userFound.users){
            throw new UnauthorizedException(Messages.INVALID_USER);
        }

        let currentUser: User = userFound.users[0];
        currentUser.updatedBy = user.userId;
        currentUser = Object.assign(currentUser, updateUserRequest);
        await this.userService.updateUser(currentUser).toPromise();
        return this.commonFunctionService.successResponse(Messages.USER_UPDATED);
    }
}


