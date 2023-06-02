/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "merchants";

export interface EmptyArgument {
}

export interface Merchants {
  merchants: Merchant[];
}

export interface Merchant {
  id: number;
  mId: number;
  companyName: string;
  transactionEmail: string;
  userId: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  paymentMethod: string;
  paymentDetails: string;
  profileImage: string;
  merchantStatus: string;
  status: number;
  createdBy: number;
  createdDate: string;
  updatedBy: number;
  updatedDate: string;
  deletedBy: number;
  deletedDate: string;
}

export interface SearchMerchantBy {
  id: number;
  mId: number;
  companyName: string;
  transactionEmail: string;
  userId: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  paymentMethod: string;
  merchantStatus: string;
  status: number;
  createdBy: number;
  take: number;
  skip: number;
}

export interface MerchantReport {
  data: Merchants | undefined;
  total: number;
  count: number;
}

export const MERCHANTS_PACKAGE_NAME = "merchants";

export interface MerchantsServiceClient {
  getAll(request: EmptyArgument): Observable<Merchants>;

  createMerchant(request: Merchant): Observable<Merchant>;

  searchMerchant(request: SearchMerchantBy): Observable<Merchants>;

  updateMerchant(request: Merchant): Observable<Merchant>;

  deleteMerchant(request: Merchant): Observable<Merchant>;

  getMerchantReport(request: SearchMerchantBy): Observable<MerchantReport>;
}

export interface MerchantsServiceController {
  getAll(request: EmptyArgument): Promise<Merchants> | Observable<Merchants> | Merchants;

  createMerchant(request: Merchant): Promise<Merchant> | Observable<Merchant> | Merchant;

  searchMerchant(request: SearchMerchantBy): Promise<Merchants> | Observable<Merchants> | Merchants;

  updateMerchant(request: Merchant): Promise<Merchant> | Observable<Merchant> | Merchant;

  deleteMerchant(request: Merchant): Promise<Merchant> | Observable<Merchant> | Merchant;

  getMerchantReport(request: SearchMerchantBy): Promise<MerchantReport> | Observable<MerchantReport> | MerchantReport;
}

export function MerchantsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getAll",
      "createMerchant",
      "searchMerchant",
      "updateMerchant",
      "deleteMerchant",
      "getMerchantReport",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MerchantsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MerchantsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MERCHANTS_SERVICE_NAME = "MerchantsService";
