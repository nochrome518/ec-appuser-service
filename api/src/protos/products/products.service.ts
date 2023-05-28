/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "products";

export interface EmptyArgument {
}

export interface Products {
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: number;
  createdBy: number;
  createdDate: string;
  updatedBy: number;
  updatedDate: string;
  deletedBy: number;
  deletedDate: string;
  category: string;
}

export interface SearchProductBy {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: number;
  createdBy: number;
  category: string;
  take: number;
  skip: number;
}

export interface ProductReport {
  data: Products | undefined;
  total: number;
  count: number;
}

export const PRODUCTS_PACKAGE_NAME = "products";

export interface ProductsServiceClient {
  getAll(request: EmptyArgument): Observable<Products>;

  createProduct(request: Product): Observable<Product>;

  searchProduct(request: SearchProductBy): Observable<Products>;

  updateProduct(request: Product): Observable<Product>;

  deleteProduct(request: Product): Observable<Product>;

  getProductReport(request: SearchProductBy): Observable<ProductReport>;
}

export interface ProductsServiceController {
  getAll(request: EmptyArgument): Promise<Products> | Observable<Products> | Products;

  createProduct(request: Product): Promise<Product> | Observable<Product> | Product;

  searchProduct(request: SearchProductBy): Promise<Products> | Observable<Products> | Products;

  updateProduct(request: Product): Promise<Product> | Observable<Product> | Product;

  deleteProduct(request: Product): Promise<Product> | Observable<Product> | Product;

  getProductReport(request: SearchProductBy): Promise<ProductReport> | Observable<ProductReport> | ProductReport;
}

export function ProductsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getAll",
      "createProduct",
      "searchProduct",
      "updateProduct",
      "deleteProduct",
      "getProductReport",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProductsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProductsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRODUCTS_SERVICE_NAME = "ProductsService";
