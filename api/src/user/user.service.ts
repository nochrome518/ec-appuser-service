import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from 'src/models/requests/create-user.request';
import { UserLoginRequest } from 'src/models/requests/user-login.request';

@Injectable()
export class UserService {
    constructor(){}

   async createUser(createUserRequest: CreateUserRequest, req: any): Promise<any>{
   }

   async userLogin(userLoginRequest: UserLoginRequest, req: any): Promise<any>{
   }

   async searchUser(email: string): Promise<any>{
   }
}
