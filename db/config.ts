import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();

export default {
  development: {
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    dialect: 'mysql',
  },
};
