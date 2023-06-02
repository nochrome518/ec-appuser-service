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
import { JWTokenModule } from './jwt/jwt.module';
import { ProductModule } from './product/product.module';
import { MerchantModule } from './merchant/merchant.module';
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
            `application.msUser${environment}`,
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
      },
      {
        name: 'PRODUCTS_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const environment = configService.get<string>('application.msEnv');
          const url = configService.get<string>(`application.msProduct${environment}`);
          return {
            name: 'PRODUCTS_PACKAGE',
            transport: Transport.GRPC,
            options: {
              url: url,
              package: 'products',
              protoPath: join(__dirname, './protos/products/products.proto'),
            },
          }
        }
      },
      {
        name: 'MERCHANTS_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const environment = configService.get<string>('application.msEnv');
          const url = configService.get<string>(
          `application.msMerchantLocal`,
          );
          return {
            name: 'MERCHANTS_PACKAGE',
            transport: Transport.GRPC,
            options: {
            package: 'merchants',
            protoPath: join(__dirname, './protos/merchants/merchants.proto'),
            url: url
            },
          };
        },
      }
    ]),
    UserModule,
    CommonServices,
    AuthModule,
    JWTokenModule,
    ProductModule,
    MerchantModule,],

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
