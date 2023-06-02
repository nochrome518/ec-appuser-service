import { IsIn, IsNotEmpty } from "class-validator";

export class CreateMerchantRequest {
    @IsNotEmpty() mId: number;
    @IsNotEmpty() companyName: string;
    @IsNotEmpty() transactionEmail: string;
    @IsNotEmpty() contactName: string;
    @IsNotEmpty() contactPhone: string;
    @IsNotEmpty() contactEmail: string;
    contactAddress: string;
    @IsIn(Object.values(['upi','card'])) paymentMethod: string;
    paymentDetails: string;
    profileImage: string;
}

export class CreateMerchantBO {
    @IsNotEmpty() mId: number;
    @IsNotEmpty() companyName: string;
    @IsNotEmpty() transactionEmail: string;
    @IsNotEmpty() userId: number;
    @IsNotEmpty() contactName: string;
    @IsNotEmpty() contactPhone: string;
    @IsNotEmpty() contactEmail: string;
    contactAddress: string;
    @IsIn(Object.values(['upi','card'])) paymentMethod: string;
    paymentDetails: string;
    profileImage: string;
}

export class UpdateMerchantRequest {
    mId: number;
    companyName: string;
    transactionEmail: string;
    contactName: string;
    ontactPhone: string;
    contactEmail: string;
    contactAddress: string;
    @IsIn(Object.values(['upi','card'])) paymentMethod: string;
    paymentDetails: string;
    profileImage: string;
}

export interface SearchMerchantRequest {
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
    pageSize: number;
    pageIndex: number;
}