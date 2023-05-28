import { Product } from "src/protos/products/products.service";

export class ProductResponse {
    products: Product[];
    total: number;
    count: number;
    page: number;
    pageCount?: number;
}