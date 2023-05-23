import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import applicationConfig from 'src/config/app.config';
require('dotenv').config();

@Injectable()
export class JwtService {
	private readonly secretKey = process.env.SECRET_KEY;
	private readonly expiresIn = process.env.EXPIRES_IN;
	private readonly refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;
	private expiryTime = 10;

	constructor(
		@Inject(applicationConfig.KEY)
		private appConfig: ConfigType<typeof applicationConfig>,
	){}

	generateToken(payload: any): string {
		const iatTime = Math.floor(Date.now() / 1000);
		const expiry = Math.floor(Date.now() / 1000) + (60 * this.expiryTime);

		const accessToken = jwt.sign({
			iss: this.appConfig.clientEmail,
			sub: this.appConfig.clientEmail,
			iat: iatTime,
			exp: expiry,
			userId: payload.id,
			email: payload.email,
			type: payload.type,
			expiresIn: this.expiresIn,
		}, this.secretKey, { algorithm: "RS256" });

		return accessToken;
	}

	verifyToken(token: string): any {
		try {
			return jwt.verify(token, this.secretKey);
		} catch (error) {
			throw new Error('Invalid token');
		}
	}

}