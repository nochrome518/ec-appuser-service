import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserRequest } from 'src/models/requests/create-user.request';
import { UserLoginRequest } from 'src/models/requests/user-login.request';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { User, UsersServiceClient, SearchUserBy } from 'src/protos/users/users.service';
import { CommonServices } from 'src/utilities/common-service';
import { Messages } from 'src/constants/messages';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserRequest } from 'src/models/requests/update-user.request';
import { v4 as uuidv4 } from 'uuid';
import { AuthUser } from 'src/models/auth.user';
import { Status } from 'src/models/enums/status.enum';
import { DateTimeService } from 'src/utilities/date-time.service';
import { SearchUserRequest } from 'src/models/requests/search-user.request';
import { UserResponse } from 'src/models/responses/user.response';
import { UserType } from 'src/models/enums/user-type.enum';


@Injectable()
export class UserService {
    private userService: UsersServiceClient;

    constructor(
        @Inject('USERS_PACKAGE') private client: ClientGrpc,
        private commonFunctionService: CommonServices,
        private authService: AuthService,
        public dateTimeService: DateTimeService
    ) {}

    onModuleInit() {
      this.userService = this.client.getService<UsersServiceClient>('UsersService');
    }

    generateUID(): string {
        return uuidv4();
    }

    async createUser(createUserRequest: CreateUserRequest): Promise<any> {
        const searchUserBy: SearchUserBy = {} as SearchUserBy;
        searchUserBy.email = createUserRequest.email;
        const userData = await this.userService.searchUser(searchUserBy).toPromise(); 
        if(userData && userData.users && userData.users.length != 0){
            throw new UnauthorizedException(Messages.EMAIL_EXISTS);
        }

        const createUser: User = createUserRequest as any;
        const hashedPass = await this.authService.hashPassword(createUserRequest.password);
        createUser.password = hashedPass;
        createUser.uid = this.generateUID(); 
        await this.userService.createUser(createUser).toPromise()
        return this.commonFunctionService.successResponse(Messages.USER_CREATED);
    }

    async userLogin(userLoginRequest: UserLoginRequest): Promise<any> {
        const searchUserBy: SearchUserBy = {} as SearchUserBy;
        searchUserBy.email = userLoginRequest.email;
        const userData = await this.userService.searchUser(searchUserBy).toPromise(); 
        if(!userData || !userData.users || userData.users.length == 0){
            throw new UnauthorizedException(Messages.INVALID_USER_EMAIL);
        }

        const authResponse = await this.authService.validateUser(userData.users[0], userLoginRequest.password)
        return this.commonFunctionService.successResponseWithData(Messages.TOKEN_GENERATE,authResponse);
    }

    async updateUserById(updateUserRequest: UpdateUserRequest, id: number, user: AuthUser): Promise<any> {
        const searchUserBy: SearchUserBy = {} as SearchUserBy;
        searchUserBy.id = id;
        const userData = await this.userService.searchUser(searchUserBy).toPromise(); 
        if(!userData || !userData.users || userData.users.length == 0){
            throw new UnauthorizedException(Messages.INVALID_USER);
        }

        let currentUser: User = userData.users[0];
        currentUser.updatedBy = user.userId;
        currentUser.updatedDate = this.dateTimeService.currentDate();
        currentUser = Object.assign(currentUser, updateUserRequest);
        await this.userService.updateUser(currentUser).toPromise();
        return this.commonFunctionService.successResponse(Messages.USER_UPDATED);
    }

    async deleteUserById(id: number, user: AuthUser): Promise<any> {
        const searchUserBy: SearchUserBy = {} as SearchUserBy;
        searchUserBy.id = id;
        const userData = await this.userService.searchUser(searchUserBy).toPromise(); 
        if(!userData || !userData.users || userData.users.length == 0){
            throw new UnauthorizedException(Messages.INVALID_USER);
        }

        let currentUser: User = userData.users[0];
        currentUser.status = Status.Deleted;
        currentUser.deletedBy = user.userId;
        currentUser.deletedDate = currentUser.updatedDate = this.dateTimeService.currentDate();
        await this.userService.deleteUser(currentUser).toPromise();
        return this.commonFunctionService.successResponse(Messages.USER_DELETED);
    }

    async getUsersList(userReportRequest: SearchUserRequest, user: AuthUser): Promise<any> {
        if(user.role != UserType.admin){
            throw new UnauthorizedException(Messages.NO_PERMISSION);
        }

        const userList: SearchUserBy = userReportRequest as any;
        if (userReportRequest.pageSize) {
            userList.take = userReportRequest.pageSize;
        }
        if (userReportRequest.pageIndex) {
            userList.skip = (userReportRequest.pageIndex - 1) * userReportRequest.pageSize;
        }
        const userListData = await this.userService.getUserReport(userList).toPromise();
        if (userListData.total == 0) {
          throw new HttpException(this.commonFunctionService.failureResponse(Messages.NO_DATA), HttpStatus.BAD_REQUEST,);
        }
        this.dateTimeService.convertProtoBufDateString(userListData.data.users);
        const customerResponseData: UserResponse = {
          users: userListData.data.users,
          total: userListData.total,
          count: userListData.count,
          page: userListData.total ? userReportRequest.pageIndex : 0,
          pageCount: userReportRequest.pageSize ? Math.floor((userListData.total + userReportRequest.pageSize - 1) / userReportRequest.pageSize) : 0
        }
        return this.commonFunctionService.successResponseWithData(Messages.USER_LIST, customerResponseData);
    }
}


