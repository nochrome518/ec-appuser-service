import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class JwtMiddlewareService implements NestMiddleware {
    constructor(){}

    use(request: Request, response: Response, next: NextFunction){
        const postRequest = ['/user/register','/user/login']
        if(request.method === 'POST' && postRequest.includes(request.originalUrl)){
            next();
            return;
        }

        // if(!request.headers.authorization){
        //     throw new UnauthorizedException();
        // }

        if(request.body.email){
            console.log(request.body.email)
        }
    }
}