import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { LocalStrategy } from './stratigies/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
  imports: [AccountModule],
})
export class AuthModule {}
