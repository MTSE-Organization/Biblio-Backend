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
  RegisterForm,
  ResendOtpForm
} from './forms';
import { JwtAuthGuard } from './guards';
import { UserDetailsDto, UserInfoGoogleDto } from './dtos';
import { GoogleService } from './google.service';
import { ApiResponseNoData } from '@/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService
  ) {}

  @ApiResponseNoData({
    message: 'Register successfully'
  })
  @Post('register')
  async register(@Body() form: RegisterForm) {
    return await this.authService.register(form);
  }

  @ApiResponseNoData({
    message: 'Verify otp successfully'
  })
  @Post('verify-otp')
  async verifyOtp(@Body() form: ActiveAccountForm) {
    return this.authService.verifyOtp(form);
  }

  @ApiResponseNoData({
    message: 'Resend OTP successfully'
  })
  @Post('resend-otp')
  async resendOtp(@Body() form: ResendOtpForm) {
    return await this.authService.resendOtp(form.email);
  }

  @ApiResponseNoData({
    message: 'Forgot password successfully'
  })
  @Post('forgot-password')
  async forgotPassword(@Body() form: ForgotPasswordForm) {
    return await this.authService.forgotPassword(form);
  }

  @ApiResponseNoData({
    message: 'Change password successfully'
  })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req, @Body() form: ChangePasswordForm) {
    const user: UserDetailsDto = req.user;
    return await this.authService.changePassword(user.id, form);
  }

  @ApiResponseNoData({
    message: 'Login successfully'
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }

  @ApiResponseNoData({
    message: 'Get link successfully'
  })
  @Get('google')
  googleLogin() {
    return this.googleService.generateAuthUrl();
  }

  @ApiResponseNoData({
    message: 'Login successfully'
  })
  @Post('google/callback')
  async googleCallback(@Query('code') code: string) {
    const userInfo: UserInfoGoogleDto =
      await this.googleService.getUserInfo(code);
    return await this.authService.handleSocialLogin(userInfo);
  }
}
