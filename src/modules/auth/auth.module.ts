import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';
import { HttpModule } from '@nestjs/axios';
import { GoogleService } from './google.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
    GoogleService
  ],
  imports: [AccountModule, OtpModule, MailModule, HttpModule],
  exports: [JwtAuthGuard]
})
export class AuthModule {}
