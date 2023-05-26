import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import  applicationConfig  from 'src/config/app.config';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CommonServices } from 'src/utilities/common-service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from 'src/jwt/jwt.service';
import { DateTimeService } from 'src/utilities/date-time.service';
@Module({
      imports: [
    ConfigModule.forRoot({
      load: [applicationConfig],
      isGlobal: true
    }),
    ClientsModule.registerAsync([
      {
        name: 'USERS_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            const environment = configService.get<string>('application.msEnv');
            const url = configService.get<string>(
              `application.msUserLocal`,
            );
          	return {
				name: 'USERS_PACKAGE',
				transport: Transport.GRPC,
				options: {
				package: 'users',
				protoPath: join(__dirname, './protos/users/users.proto'),
				url: url
				},
            };
        },
      }
    ]),
    UserModule,],
  controllers: [UserController],
  providers: [UserService,CommonServices,AuthService,JwtService,DateTimeService],
})
export class UserModule {}
