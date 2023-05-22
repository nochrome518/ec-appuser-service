import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { MiddlewareService } from 'src/auth/nest-middleware';
import { JwtMiddlewareService } from 'src/auth/jwt-middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import  applicationConfig  from 'src/config/app.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CommonServices } from './utilities/common-service';
import { AuthModule } from './auth/auth.module';

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
            `application.usersServiceUrl`,
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
    UserModule,
    CommonServices,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(MiddlewareService,JwtMiddlewareService)
    .forRoutes('*')
  }
}
