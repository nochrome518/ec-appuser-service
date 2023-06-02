import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import  applicationConfig  from 'src/config/app.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CommonServices } from 'src/utilities/common-service';
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
					protoPath: join(__dirname, '../protos/users/users.proto'),
					url: url
					},
				};
			},
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
            protoPath: join(__dirname, '../protos/merchants/merchants.proto'),
            url: url
            },
          };
        },
      }
      ]),
    MerchantModule
  ],
  controllers: [MerchantController],
  providers: [MerchantService,CommonServices,DateTimeService]
})
export class MerchantModule {}
