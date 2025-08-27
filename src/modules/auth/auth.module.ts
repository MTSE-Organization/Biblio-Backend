import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { JwtStrategy, LocalStrategy } from './stratigies';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { OtpModule } from '../otp/otp.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
  ],
  imports: [AccountModule, OtpModule],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
