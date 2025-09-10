import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';

export const mailConfig: MailerAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('MAIL_HOST'),
      port: configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: configService.get<string>('MAIL_USERNAME'),
        pass: configService.get<string>('MAIL_PASSWORD')
      }
    },
    defaults: {
      from: `"No Reply" <${configService.get<string>('MAIL_FROM')}>`
    },
    template: {
      dir: join(__dirname, '../mail/templates/'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true
      }
    }
  })
};
