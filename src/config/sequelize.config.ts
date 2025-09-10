import {
  Account,
  Category,
  Group,
  GroupPermission,
  Permission
} from '@/models';
import { CartItem } from '@/models/cart-item.model';
import { Cart } from '@/models/cart.model';
import { Contributor } from '@/models/contributor';
import { PermissionGroup } from '@/models/permission-group.model';
import { ProductImage } from '@/models/product-image.model';
import { Product } from '@/models/product.model';
import { Publisher } from '@/models/publisher';
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
      Publisher
    ],
    define: {
      underscored: true,
      createdAt: 'created_date',
      updatedAt: 'modified_date'
    }
  })
};
