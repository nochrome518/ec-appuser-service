import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Messages } from 'src/constants/messages';
import { AuthUser } from 'src/models/auth.user';
import { CreateProductRequest, SearchProductRequest, UpdateProductRequest } from 'src/models/requests/product.request';
import { Product, ProductsServiceClient, SearchProductBy } from 'src/protos/products/products.service';
import { CommonServices } from 'src/utilities/common-service';
import { DateTimeService } from 'src/utilities/date-time.service';
import { Status } from 'src/models/enums/status.enum'
import { ProductResponse } from 'src/models/responses/product.response';

@Injectable()
export class ProductService {
    private productService: ProductsServiceClient;

    constructor(
        @Inject('PRODUCTS_PACKAGE') private client: ClientGrpc,
        private commonFunctionService: CommonServices,
        public dateTimeService: DateTimeService
    ) {}

    onModuleInit() {
      this.productService = this.client.getService<ProductsServiceClient>('ProductsService');
    }

    async createProduct(createProductRequest: CreateProductRequest, user: AuthUser): Promise<any> {
        const createProduct: Product = createProductRequest as any;
        createProduct.createdBy = user.userId;
        await this.productService.createProduct(createProduct).toPromise()
        return this.commonFunctionService.successResponse(Messages.PRODUCT_CREATED);
    }

    async updateProductById(updateProductRequest: UpdateProductRequest, id: number, user: AuthUser): Promise<any> {
        const searchProductBy: SearchProductBy = {} as SearchProductBy;
        searchProductBy.id = id;
        const productData = await this.productService.searchProduct(searchProductBy).toPromise(); 
        if(!productData || !productData.products || productData.products.length == 0){
            throw new UnauthorizedException(Messages.INVALID_PRODUCT);
        }

        let currentProduct: Product = productData.products[0];
        currentProduct.updatedBy = user.userId;
        currentProduct.updatedDate = this.dateTimeService.currentDate();
        currentProduct = Object.assign(currentProduct, updateProductRequest);
        await this.productService.updateProduct(currentProduct).toPromise();
        return this.commonFunctionService.successResponse(Messages.PRODUCT_UPDATED);
    }

    async deleteProductById(id: number, user: AuthUser): Promise<any> {
        const searchProductBy: SearchProductBy = {} as SearchProductBy;
        searchProductBy.id = id;
        const productData = await this.productService.searchProduct(searchProductBy).toPromise(); 
        if(!productData || !productData.products || productData.products.length == 0){
            throw new UnauthorizedException(Messages.INVALID_PRODUCT);
        }

        let currentUser: Product = productData.products[0];
        currentUser.status = Status.Deleted;
        currentUser.deletedBy = user.userId;
        currentUser.deletedDate = currentUser.updatedDate = this.dateTimeService.currentDate();
        await this.productService.deleteProduct(currentUser).toPromise();
        return this.commonFunctionService.successResponse(Messages.PRODUCT_DELETED);
    }

    async getProductList(productReportRequest: SearchProductRequest, user: AuthUser): Promise<any> {
        const productList: SearchProductBy = productReportRequest as any;
        if (productReportRequest.pageSize) {
            productList.take = productReportRequest.pageSize;
        }
        if (productReportRequest.pageIndex) {
            productList.skip = (productReportRequest.pageIndex - 1) * productReportRequest.pageSize;
        }
        const userListData = await this.productService.getProductReport(productList).toPromise();
        if (userListData.total == 0) {
          throw new HttpException(this.commonFunctionService.failureResponse(Messages.NO_DATA), HttpStatus.BAD_REQUEST,);
        }
        this.dateTimeService.convertProtoBufDateString(userListData.data.products);
        const customerResponseData: ProductResponse = {
          products: userListData.data.products,
          total: userListData.total,
          count: userListData.count,
          page: userListData.total ? productReportRequest.pageIndex : 0,
          pageCount: productReportRequest.pageSize ? Math.floor((userListData.total + productReportRequest.pageSize - 1) / productReportRequest.pageSize) : 0
        }
        return this.commonFunctionService.successResponseWithData(Messages.PRODUCT_LIST, customerResponseData);
    }
}
