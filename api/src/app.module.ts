import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { MiddlewareService } from 'src/auth/nest-middleware';
import { JwtMiddlewareService } from 'src/auth/jwt-middleware';
import { ConfigModule } from '@nestjs/config';
import  applicationConfig  from 'src/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [applicationConfig],
      isGlobal: true
    }),
    
    UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(MiddlewareService,JwtMiddlewareService)
    .forRoutes('*')
  }
}
