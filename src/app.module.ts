//#region import
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { sequelizeConfig } from './config/sequelize.config';
import { GroupModule } from './modules/group/group.module';
import { CategoryModule } from './modules/category/category.module';
import { PermissionModule } from './modules/permission/permission.module';
import { StartTimingMiddleware } from './common/middlewares/start-timing.middleware';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from './modules/otp/otp.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './modules/mail/mail.module';
import { cacheConfig, jwtConfig, mailConfig } from './config';
import { FileModule } from './modules/file/file.module';
import { ProductImageModule } from './modules/product-image/product-image.module';
import { ProductModule } from './modules/product/product.module';
//#endregion

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync(sequelizeConfig),
    JwtModule.registerAsync(jwtConfig),
    CacheModule.registerAsync(cacheConfig),
    MailerModule.forRootAsync(mailConfig),
    AuthModule,
    AccountModule,
    GroupModule,
    CategoryModule,
    PermissionModule,
    OtpModule,
    MailModule,
    FileModule,
    ProductImageModule,
    ProductModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StartTimingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
