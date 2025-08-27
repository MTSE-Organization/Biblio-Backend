import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ActiveAccountForm,
  ChangePasswordForm,
  ForgotPasswordForm,
  RegisterForm,
} from './form';

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

  @Post('change-password')
  async changePassword(@Body() form: ChangePasswordForm) {
    return await this.authService.changePassword(form);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }
}
