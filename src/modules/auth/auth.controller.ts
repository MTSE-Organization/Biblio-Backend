import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ActiveAccountForm,
  ChangePasswordForm,
  ForgotPasswordForm,
  RegisterForm
} from './forms';
import { JwtAuthGuard } from './guards';
import { UserDetailsDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() form: RegisterForm) {
    return await this.authService.register(form);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() form: ActiveAccountForm) {
    return this.authService.verifyOtp(form);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() form: ForgotPasswordForm) {
    return await this.authService.forgotPassword(form);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req, @Body() form: ChangePasswordForm) {
    const user: UserDetailsDto = req.user;
    return await this.authService.changePassword(user.id, form);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }
}
