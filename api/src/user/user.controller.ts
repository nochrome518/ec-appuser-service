import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from 'src/models/requests/create-user.request';
import { UserLoginRequest } from 'src/models/requests/user-login.request';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    
    @Post('register')
    createUser(@Body() createUserRequest: CreateUserRequest, @Req() req: any): Promise<any> {
      return this.userService.createUser(createUserRequest,req);
    }

    @Post('login')
    userLoginWithEmail(@Body() userLoginRequest: UserLoginRequest, @Req() req: any): Promise<any> {
      return this.userService.userLogin(userLoginRequest,req);
    }

}
