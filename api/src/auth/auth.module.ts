import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CommonServices } from 'src/utilities/common-service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports: [],
    controllers: [],
    providers: [AuthService,CommonServices,JwtService],
})
export class AuthModule {
    
}