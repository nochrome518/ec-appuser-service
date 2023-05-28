import { IsIn, IsOptional,IsNotEmpty } from "class-validator";
import { ProductType } from "../enums/product-type.enum";

export class CreateProductRequest {
    @IsNotEmpty() name: string;
    @IsNotEmpty() description: string;
    @IsNotEmpty() price: number;
    @IsNotEmpty() quantity: number;
    @IsIn(Object.values(ProductType)) category: string;
}

export class UpdateProductRequest {
    name: string;
    description: string;
    price: number;
    quantity: number;
    @IsIn(Object.values(ProductType)) category: string;
}

export interface SearchProductRequest {
    id: number;
    name: string;
    category: string;
    price: number;
    status: number;
    pageSize: number;
    pageIndex: number;
}