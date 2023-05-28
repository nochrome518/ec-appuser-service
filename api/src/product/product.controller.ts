import { Controller, Patch, Post, Delete, Body, Param, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductRequest, SearchProductRequest, UpdateProductRequest } from 'src/models/requests/product.request';
import { Request } from 'express';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    @Post('create')
    createProduct(@Body() createProductRequest: CreateProductRequest, @Req() req:Request): Promise<any> {
      	return this.productService.createProduct(createProductRequest, req.user);
    }

    @Patch(':id')
    updateProduct(@Body() updateProductRequest: UpdateProductRequest, @Param('id') id: number, @Req() req: Request): Promise<any> {
      	return this.productService.updateProductById(updateProductRequest, id, req.user);
    }

	@Delete(':id')
    deleteProduct(@Param('id') id: number, @Req() req:Request): Promise<any> {
      	return this.productService.deleteProductById(id, req.user);
    }

	@Post('list')
    getProductReport(@Body() productReportRequest: SearchProductRequest, @Req() req:Request): Promise<any> {
      	return this.productService.getProductList(productReportRequest, req.user);
    }
}
