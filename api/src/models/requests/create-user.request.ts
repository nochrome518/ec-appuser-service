import { IsIn, IsOptional,IsNotEmpty } from "class-validator";
import { UserType } from '../enums/user-type.enum';

export class CreateUserRequest {
    @IsNotEmpty() fullName: string;
    @IsNotEmpty() email: string;
    @IsNotEmpty() password: string;
    phoneNo: string;
    @IsIn(Object.values(UserType)) type: string; 
}