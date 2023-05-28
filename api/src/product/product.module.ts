import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import  applicationConfig  from 'src/config/app.config';
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
			name: 'PRODUCTS_PACKAGE',
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const environment = configService.get<string>('application.msEnv');
				const url = configService.get<string>(
				`application.msProductLocal`,
				);
				return {
					name: 'PRODUCTS_PACKAGE',
					transport: Transport.GRPC,
					options: {
					package: 'products',
					protoPath: join(__dirname, '../protos/products/products.proto'),
					url: url
					},
				};
			},
		}
		]),
		ProductModule],
	controllers: [ProductController],
	providers: [ProductService,CommonServices,DateTimeService]
})
export class ProductModule {}
