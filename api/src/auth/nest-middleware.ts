import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Request, Response, NextFunction } from 'express';
import  applicationConfig from 'src/config/app.config';
import { Messages } from 'src/constants/messages'

@Injectable()
export class MiddlewareService implements NestMiddleware{

    constructor(
        @Inject(applicationConfig.KEY)
        private appConfig: ConfigType<typeof applicationConfig>
    ){}

    use(request: Request, response: Response, next: NextFunction){
        const postRequest = ['/user/register','/user/login']
        console.log(request.originalUrl)
        if(request.method === 'POST' && postRequest.includes(request.originalUrl)){
            next();
            return;
        }

        if (!request.headers["x-api-key"]){
            throw new UnauthorizedException();
        } else if (this.appConfig.apiKey != request.headers["x-api-key"]){
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: Messages.INVALID_API_KEY}, HttpStatus.FORBIDDEN);
        }
        next();
    }
}