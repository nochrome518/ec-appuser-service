import { ExceptionFilter, ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { Response } from 'express';
import { AuthService } from "src/auth/auth.service";
import { IResponse } from "../common-service";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	
    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();
        
        console.log('exception occured');
        console.log(exception);
        
        switch(exception.status) {
            case 400:
            case 401:
            case 403:
            case 404:
                response.status(exception.status).send(exception.response);
                return;
            default:
                this.parseError(exception, response);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    parseError(exception: any, response: Response<any>): void {
        if (exception.code && exception.code === 2) {
            let exceptionDetails = {};
            try {
                exceptionDetails = JSON.parse(exception.details);
            } catch (error) {
                exceptionDetails = { 
                    success: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: exception.details,
                    error: 'Bad Request'
                };
            }
            response.status(400).json(exceptionDetails);
            return;
        }

        const errorResponse: IResponse = {
            success: false,
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'An error has occured, please contact administrator',
            error: 'Bad Request'
        };
    
        response.status(errorResponse.statusCode).json(errorResponse);
    }
}