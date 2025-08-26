import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sequelizeConfig } from './config/sequelize.config';
import { GroupModule } from './modules/group/group.module';
import { CategoryModule } from './modules/category/category.module';
import { PermissionModule } from './modules/permission/permission.module';
import { StartTimingMiddleware } from './common/middlewares/start-timing.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService): SequelizeModuleOptions =>
        sequelizeConfig(ConfigService),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        global: true,
        secret: ConfigService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: ConfigService.get<string>('JWT_EXPIRES_IN') },
      }),
      global: true,
    }),
    AuthModule,
    AccountModule,
    GroupModule,
    CategoryModule,
    PermissionModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StartTimingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
