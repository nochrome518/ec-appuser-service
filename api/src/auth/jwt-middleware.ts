import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class JwtMiddlewareService implements NestMiddleware {
    constructor(private jwtService: JwtService) {}

    use(request: Request, response: Response, next:() => void): Promise<void> {
        const postRequest = ['/user/register','/user/login']
        if(request.method === 'POST' && postRequest.includes(request.originalUrl)){
            next();
            return;
        }

        if(!request.headers.authorization){
            throw new UnauthorizedException();
        }

        const authUser = this.jwtService.verifyToken(request.headers.authorization);
        console.log("authUser:",authUser)
        if (!authUser) {
            throw new UnauthorizedException();
        }

        request.user = authUser;
        next();

        // if(request.body.email){
        //     console.log(request.body.email)
        // }
    }
}