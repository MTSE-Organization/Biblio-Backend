import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AccountService } from '@/modules/account/account.service';
import { UserDetailsDto } from '../dtos';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private accountService: AccountService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserDetailsDto> {
    return await this.accountService.validateUser(email, password); // Validate user credentials -> req.user
  }
}
