import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from 'src/config/app.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [applicationConfig],
			isGlobal: true
		}),
	],
	controllers: [],//[AuthController],
	providers: [JwtService],
	exports: [JwtService],
})
export class JWTokenModule {}
