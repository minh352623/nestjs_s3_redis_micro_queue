import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import 'dotenv/config';
import { UserRepository } from './repositories/user.repository';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TwoFactorAuthenticationService } from './services/twoFactorAuthentication.service';
import { JwtTwoFactorStrategy } from './jwtTwoFactor.strategy';
import { TwoFactorAuthenticationController } from './controllers/twoFactorAuthentication.controller';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.SERECT_JWT,
      signOptions: {
        expiresIn: process.env.EXPIRESIN,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    UserService,
    UserRepository,
    JwtStrategy,
    AuthService,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
  ],
  controllers: [
    UserController,
    AuthController,
    TwoFactorAuthenticationController,
  ],
  exports: [JwtStrategy],
})
export class UserModule {}
