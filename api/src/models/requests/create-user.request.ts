import { IsIn, IsOptional,IsNotEmpty } from "class-validator";
import { UserType } from '../enums/user-type.enum';

export class CreateUserRequest {
    @IsNotEmpty() fullName: string;
    @IsNotEmpty() email: string;
    @IsNotEmpty() password: string;
    phoneNumber: string;
    @IsIn(Object.values(UserType)) type: string;
    @IsNotEmpty() dob: string;
    city: string;
    addressLine: string;
    country: string;
}