import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { User } from '../schemas/user.schema';
import 'dotenv/config';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(private readonly userService: UserService) {}

  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
      secret,
    );
    await this.userService.setTwoFactorAuthenticationSecret(secret, user._id);
    return {
      secret,
      otpAuthUrl,
    };
  }

  async isTwoFactorAuthenticationCodeValid(code, user) {
    return authenticator.verify({
      token: code,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
