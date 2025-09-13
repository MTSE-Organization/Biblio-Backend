import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ActiveAccountForm,
  ChangePasswordForm,
  ForgotPasswordForm,
  RegisterForm
} from './forms';
import { JwtAuthGuard } from './guards';
import { UserDetailsDto, UserInfoGoogleDto } from './dtos';
import { GoogleService } from './google.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService
  ) {}

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

  @Get('google')
  googleLogin() {
    return this.googleService.generateAuthUrl();
  }

  @Post('google/callback')
  async googleCallback(@Query('code') code: string) {
    const userInfo: UserInfoGoogleDto =
      await this.googleService.getUserInfo(code);
    return await this.authService.handleSocialLogin(userInfo);
  }
}
