import { Body, Controller, Delete, Param, Patch, Post, Req } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { Request } from 'express';
import { CreateMerchantBO, CreateMerchantRequest, SearchMerchantRequest, UpdateMerchantRequest } from 'src/models/requests/merchant.request';


@Controller('merchant')
export class MerchantController {
    constructor(private merchantService: MerchantService){}

    @Post('on-board')
    createMerchantBO(@Body() createMerchantRequest: CreateMerchantBO, @Req() req:Request): Promise<any> {
      	return this.merchantService.createMerchantBO(createMerchantRequest, req.user);
    }

    @Post('register')
    createMerchant(@Body() createMerchantRequest: CreateMerchantRequest, @Req() req:Request): Promise<any> {
      	return this.merchantService.createMerchant(createMerchantRequest, req.user);
    }

    @Patch(':id')
    updateMerchant(@Body() updateMerchantRequest: UpdateMerchantRequest, @Param('id') id: number, @Req() req: Request): Promise<any> {
      	return this.merchantService.updateMerchantById(updateMerchantRequest, id, req.user);
    }

	@Delete(':id')
    deleteMerchant(@Param('id') id: number, @Req() req:Request): Promise<any> {
      	return this.merchantService.deleteMerchantById(id, req.user);
    }

	@Post('list')
    getMerchantReport(@Body() productReportRequest: SearchMerchantRequest, @Req() req:Request): Promise<any> {
      	return this.merchantService.getMerchantList(productReportRequest, req.user);
    }

}
