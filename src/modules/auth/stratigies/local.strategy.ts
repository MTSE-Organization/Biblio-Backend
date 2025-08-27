import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AccountService } from '@/modules/account/account.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private accountService: AccountService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    return await this.accountService.validateUser(email, password); // Validate user credentials -> req.user
  }
}
