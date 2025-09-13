import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BadRequestException } from '@/common/exceptions';
import { UserInfoGoogleDto } from './dtos';

@Injectable()
export class GoogleService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly tokenUri: string;
  private readonly userInfoUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID')!;
    this.clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET')!;
    this.redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI')!;
    this.tokenUri = 'https://oauth2.googleapis.com/token';
    this.userInfoUri = 'https://www.googleapis.com/oauth2/v2/userinfo';
  }

  generateAuthUrl(): { url: string } {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
      prompt: 'consent'
    });
    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    };
  }

  async exchangeCodeForAccessToken(code: string): Promise<string> {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('redirect_uri', this.redirectUri);
    params.append('grant_type', 'authorization_code');

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<Record<string, any>>(
          this.tokenUri,
          params.toString(),
          { headers }
        )
      );
      const body = response.data;
      if (!body?.access_token) {
        throw new BadRequestException(
          'Failed to exchange code with Google token'
        );
      }
      return body.access_token as string;
    } catch (err) {
      if (err.response) {
        console.error('Google token exchange failed:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      } else {
        console.error('Google token exchange unknown error:', err);
      }

      throw new BadRequestException(
        'Google token exchange failed: ' +
          (err.response?.data?.error_description || err.message)
      );
    }
  }

  async getUserInfo(code: string): Promise<UserInfoGoogleDto> {
    const accessToken = await this.exchangeCodeForAccessToken(code);

    try {
      const response = await firstValueFrom(
        this.httpService.get(this.userInfoUri, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      );

      return response.data as UserInfoGoogleDto;
    } catch (err) {
      throw new BadRequestException(
        'Failed to fetch Google user info: ' + err.message
      );
    }
  }
}
