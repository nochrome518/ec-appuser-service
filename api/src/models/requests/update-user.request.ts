import { IsIn, IsOptional,IsNotEmpty } from "class-validator";
import { UserType } from '../enums/user-type.enum';

export class UpdateUserRequest {
    fullName: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    @IsIn(Object.values(UserType)) type: string; 
    city: string;
    addressLine: string;
    country: string;
}