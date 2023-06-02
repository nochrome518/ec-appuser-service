import { Merchant } from "src/protos/merchants/merchants.service";

export class MerchantResponse {
    merchants: Merchant[];
    total: number;
    count: number;
    page: number;
    pageCount?: number;
}