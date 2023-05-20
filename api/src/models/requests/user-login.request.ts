import { IsIn, IsOptional,IsNotEmpty } from "class-validator";
import { UserType } from "../enums/user-type.enum";

export class UserLoginRequest {
    @IsNotEmpty() email: string;
    @IsNotEmpty() password: string;
    @IsIn(Object.values(UserType)) type: string; 
}