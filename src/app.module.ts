//#region import
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
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
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { PermissionGroupModule } from './modules/permission-group/permission-group.module';
import { ContributorModule } from './modules/contributor/contributor.module';
import { PublisherModule } from './modules/publisher/publisher.module';
import { ProductVariantModule } from './modules/product-variant/product-variant.module';
import { AddressModule } from './modules/address/address.module';
import { ReviewModule } from './modules/review/review.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { OrderModule } from './modules/order/order.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FavoriteProductModule } from './modules/favorite-product/favorite-product.module';
import { ViewedProductModule } from './modules/viewed-product/viewed-product.module';
import { RedisModule } from './modules/redis/redis.module';
import { ElasticSearchModule } from './modules/elastic-search/elastic-search.module';
import { RabbitmqModule } from './modules/rabbitmq/rabbitmq.module';
import { NotificationModule } from './modules/notification/notification.module';
//#endregion

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync(sequelizeConfig),
    JwtModule.registerAsync(jwtConfig),
    CacheModule.registerAsync(cacheConfig),
    MailerModule.forRootAsync(mailConfig),
    ScheduleModule.forRoot(),
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
    CartModule,
    CartItemModule,
    PermissionGroupModule,
    ContributorModule,
    PublisherModule,
    ProductVariantModule,
    AddressModule,
    ReviewModule,
    CouponModule,
    OrderModule,
    FavoriteProductModule,
    ViewedProductModule,
    RedisModule,
    ElasticSearchModule,
    RabbitmqModule,
    NotificationModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StartTimingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
