import { Injectable } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../common/constant/app.constant';

@Injectable()
export class TokenService {
  createTokens(userId) {
    const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET as string, {
      expiresIn: '5s',
    });
    const refreshToken = jwt.sign({ userId: userId }, REFRESH_TOKEN_SECRET as string, {
      expiresIn: '1d',
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  verifyAccessToken(accessToken: string, options?: jwt.VerifyOptions) {
    const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET as string, options);
    return decode;
  }

  verifyRefreshToken(refreshToken) {
    const decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string);
    return decode;
  }
}
