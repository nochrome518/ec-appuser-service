

export class CommonServices {

    constructor(){}

    async validateApiKey(apiKey: string): Promise<any>{

    }

    successResponse(msg: string): IResponse {
        const resObject: IResponse = {
            success: true,
            statusCode: 200,
            message: msg,
            // data: msg
        };
        return resObject;
    }

    successResponseWithData(msg: string, data: any): IResponse {
        const resObject: IResponse = {
            success: true,
            statusCode: 200,
            message: msg,
            data: data
        };
        return resObject;
    }

    failureResponse(msg: string, statusCode = 400): IResponse {
        const resObject = {
            success: false,
            statusCode: statusCode,
            message: msg,
            // error:msg
        };
        return resObject;
    }

    failureResponseWithError(msg: string, error: any): IResponse {
        const resObject = {
            success: false,
            statusCode: 400,
            message: msg,
            error: error,
        };
        return resObject;
    }
}
export interface IResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: any;
    fileName?: any;
    error?: any;
}
