import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from 'src/models/requests/create-user.request';
import { UserLoginRequest } from 'src/models/requests/user-login.request';
import { UpdateUserRequest } from 'src/models/requests/update-user.request';
import { Request } from 'express';
import { SearchUserRequest } from 'src/models/requests/search-user.request';

@Controller('user')
export class UserController {
  constructor(private userService: UserService){}
    
    @Post('register')
    createUser(@Body() createUserRequest: CreateUserRequest): Promise<any> {
      	return this.userService.createUser(createUserRequest);
    }

    @Post('login')
    userLoginWithEmail(@Body() userLoginRequest: UserLoginRequest): Promise<any> {
      	return this.userService.userLogin(userLoginRequest);
    }

    @Patch(':id')
    updateUser(@Body() updateUserRequest: UpdateUserRequest, @Param('id') id: number, @Req() req: Request): Promise<any> {
      	return this.userService.updateUserById(updateUserRequest, id, req.user);
    }

	@Delete(':id')
    deleteUser(@Param('id') id: number, @Req() req:Request): Promise<any> {
      	return this.userService.deleteUserById(id, req.user);
    }

	@Post('list')
    getUserReport(@Body() userReportRequest: SearchUserRequest, @Req() req:Request): Promise<any> {
      	return this.userService.getUsersList(userReportRequest, req.user);
    }

}
