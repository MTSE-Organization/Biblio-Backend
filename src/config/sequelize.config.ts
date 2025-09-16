import {
  Account,
  Address,
  Cart,
  CartItem,
  Category,
  Contributor,
  Coupon,
  Group,
  GroupPermission,
  Permission,
  PermissionGroup,
  Product,
  ProductContributor,
  ProductImage,
  ProductVariant,
  Publisher,
  Review
} from '@/models';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize/lib/sequelize';

export const sequelizeConfig: SequelizeModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    database: configService.get<string>('DB_NAME'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT'),
    dialect: configService.get<Dialect>('DB_DIALECT'),
    synchronize: false,
    autoLoadModels: true,
    models: [
      Category,
      Group,
      PermissionGroup,
      Permission,
      GroupPermission,
      Account,
      Product,
      ProductImage,
      Cart,
      CartItem,
      Contributor,
      ProductContributor,
      Publisher,
      ProductVariant,
      Address,
      Review,
      Coupon
    ],
    define: {
      underscored: true,
      createdAt: 'created_date',
      updatedAt: 'modified_date'
    }
  })
};
