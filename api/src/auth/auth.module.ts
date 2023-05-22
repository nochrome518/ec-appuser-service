import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CommonServices } from 'src/utilities/common-service';

@Module({
    imports: [],
    controllers: [],
    providers: [AuthService,CommonServices],
})
export class AuthModule {
    
}