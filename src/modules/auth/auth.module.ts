import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { JwtStrategy, LocalStrategy } from './stratigies';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
  ],
  imports: [AccountModule],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
