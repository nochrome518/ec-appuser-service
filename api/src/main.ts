import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { GlobalExceptionFilter } from './utilities/filters/global-exception.filter';

const PORT = 8999
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.enableCors({ origin: true});
	await app.listen(PORT,()=>{
		console.log(`server listening on ${PORT}`)
	});
}
bootstrap();
