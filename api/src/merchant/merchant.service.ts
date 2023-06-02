import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Merchant, MerchantsServiceClient, SearchMerchantBy } from 'src/protos/merchants/merchants.service';
import { ClientGrpc } from '@nestjs/microservices';
import { CommonServices } from 'src/utilities/common-service';
import { DateTimeService } from 'src/utilities/date-time.service';
import { AuthUser } from 'src/models/auth.user';
import { CreateMerchantBO, CreateMerchantRequest, SearchMerchantRequest, UpdateMerchantRequest } from 'src/models/requests/merchant.request';
import { Messages } from 'src/constants/messages';
import { Status } from 'src/models/enums/status.enum'
import { MerchantResponse } from 'src/models/responses/merchant.response';
import { SearchUserBy, UsersServiceClient } from 'src/protos/users/users.service';
import { UserType } from 'src/models/enums/user-type.enum';

@Injectable()
export class MerchantService {
    private merchantService: MerchantsServiceClient;
    private userService: UsersServiceClient;

    constructor(
        @Inject('MERCHANTS_PACKAGE') private clientMerchant: ClientGrpc,
        @Inject('USERS_PACKAGE') private clientUser: ClientGrpc,
        private commonFunctionService: CommonServices,
        public dateTimeService: DateTimeService
    ) {}

    onModuleInit() {
      this.merchantService = this.clientMerchant.getService<MerchantsServiceClient>('MerchantsService');
      this.userService = this.clientUser.getService<UsersServiceClient>('UsersService');
    }

    async createMerchant(createMerchantRequest: CreateMerchantRequest, user: AuthUser): Promise<any> {
        const searchMerchantBy: SearchMerchantBy = {} as SearchMerchantBy;
        searchMerchantBy.mId = createMerchantRequest.mId;
        const merchantData = await this.merchantService.searchMerchant(searchMerchantBy).toPromise(); 
        if(merchantData && merchantData.merchants && merchantData.merchants.length != 0){
            throw new UnauthorizedException(Messages.MERCHANT_EXISTS);
        }

        const createMerchant: Merchant = createMerchantRequest as any;
        createMerchant.createdBy = user.userId;
        createMerchant.userId = user.userId;
        await this.merchantService.createMerchant(createMerchant).toPromise()
        return this.commonFunctionService.successResponse(Messages.MERCHANT_CREATED);
    }

    async updateMerchantById(updateMerchantRequest: UpdateMerchantRequest, id: number, user: AuthUser): Promise<any> {
        const searchMerchantBy: SearchMerchantBy = {} as SearchMerchantBy;
        searchMerchantBy.id = id;
        const merchantData = await this.merchantService.searchMerchant(searchMerchantBy).toPromise(); 
        if(!merchantData || !merchantData.merchants || merchantData.merchants.length == 0){
            throw new UnauthorizedException(Messages.INVALID_MERCHANT);
        }

        let currentMerchant: Merchant = merchantData.merchants[0];
        currentMerchant.updatedBy = user.userId;
        currentMerchant.updatedDate = this.dateTimeService.currentDate();
        currentMerchant = Object.assign(currentMerchant, updateMerchantRequest);
        await this.merchantService.updateMerchant(currentMerchant).toPromise();
        return this.commonFunctionService.successResponse(Messages.MERCHANT_UPDATED);
    }

    async deleteMerchantById(id: number, user: AuthUser): Promise<any> {
        const searchMerchantBy: SearchMerchantBy = {} as SearchMerchantBy;
        searchMerchantBy.id = id;
        const merchantData = await this.merchantService.searchMerchant(searchMerchantBy).toPromise(); 
        if(!merchantData || !merchantData.merchants || merchantData.merchants.length == 0){
            throw new UnauthorizedException(Messages.INVALID_MERCHANT);
        }

        let currentUser: Merchant = merchantData.merchants[0];
        currentUser.status = Status.Deleted;
        currentUser.deletedBy = user.userId;
        currentUser.deletedDate = currentUser.updatedDate = this.dateTimeService.currentDate();
        await this.merchantService.deleteMerchant(currentUser).toPromise();
        return this.commonFunctionService.successResponse(Messages.MERCHANT_DELETED);
    }

    async getMerchantList(productReportRequest: SearchMerchantRequest, user: AuthUser): Promise<any> {
        if(user.role != UserType.Admin){
            throw new UnauthorizedException(Messages.NO_PERMISSION);
        }

        const merchantList: SearchMerchantBy = productReportRequest as any;
        if (productReportRequest.pageSize) {
            merchantList.take = productReportRequest.pageSize;
        }
        if (productReportRequest.pageIndex) {
            merchantList.skip = (productReportRequest.pageIndex - 1) * productReportRequest.pageSize;
        }
        const merchantListData = await this.merchantService.getMerchantReport(merchantList).toPromise();
        if (merchantListData.total == 0) {
          throw new HttpException(this.commonFunctionService.failureResponse(Messages.NO_DATA), HttpStatus.BAD_REQUEST,);
        }
        console.log(merchantListData)
        this.dateTimeService.convertProtoBufDateString(merchantListData.data.merchants);
        const customerResponseData: MerchantResponse = {
          merchants: merchantListData.data.merchants,
          total: merchantListData.total,
          count: merchantListData.count,
          page: merchantListData.total ? productReportRequest.pageIndex : 0,
          pageCount: productReportRequest.pageSize ? Math.floor((merchantListData.total + productReportRequest.pageSize - 1) / productReportRequest.pageSize) : 0
        }
        return this.commonFunctionService.successResponseWithData(Messages.MERCHANT_LIST, customerResponseData);
    }

    async createMerchantBO(createMerchantRequest: CreateMerchantBO, user: AuthUser): Promise<any> {
        if(user.role != UserType.Admin){
            throw new UnauthorizedException(Messages.NO_PERMISSION);
        }

        const searchMerchantBy: SearchMerchantBy = {} as SearchMerchantBy;
        searchMerchantBy.id = createMerchantRequest.mId;
        const merchantData = await this.merchantService.searchMerchant(searchMerchantBy).toPromise(); 
        if(merchantData && merchantData.merchants && merchantData.merchants.length != 0){
            throw new UnauthorizedException(Messages.MERCHANT_EXISTS);
        }

        const searchUserBy: SearchUserBy = {} as SearchUserBy;
        searchUserBy.id = createMerchantRequest.userId;
        const userData = await this.userService.searchUser(searchUserBy).toPromise(); 
        if(!userData || !userData.users || userData.users.length == 0){
            throw new UnauthorizedException(Messages.INVALID_USER);
        }
        
        const createMerchant: Merchant = createMerchantRequest as any;
        createMerchant.createdBy = user.userId;
        await this.merchantService.createMerchant(createMerchant).toPromise()
        return this.commonFunctionService.successResponse(Messages.MERCHANT_CREATED);
    }

}
