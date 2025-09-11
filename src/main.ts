import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from '@/common/interceptors/response.interceptor';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DelayInterceptor } from '@/common/interceptors/delay.interceptor';

async function bootstrap() {
  const configService = new ConfigService();
  const port = configService.get<string>('PORT') || 3000;
  const delay = configService.get<number>('DELAY') || 0;
  console.log('🚀 ~ bootstrap ~ delay:', delay);
  const app = await NestFactory.create(AppModule);

  // config prefix
  app.setGlobalPrefix('api/v1');

  // config logger
  const logger = new Logger('Bootstrap');

  // config global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip non-whitelisted properties
      transform: true, // automatically transform payloads to DTO instances,
      forbidNonWhitelisted: true // throw error on non-whitelisted properties
    })
  );

  // config interceptors
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new DelayInterceptor(delay));

  // config exception filters
  app.useGlobalFilters(new AllExceptionFilter());

  // config swagger
  const config = new DocumentBuilder()
    .setTitle('Biblio Service APIs')
    .setDescription('The Biblio Service APIs description')
    .setVersion('1.0')
    .addTag('biblio')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, documentFactory);

  // config server
  logger.log(`Server running on port: ${port}`);
  logger.log(`Swagger running at: http://localhost:${port}/api/v1/docs`);

  app.enableCors();
  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error('Error starting app: ', err);
  process.exit(1);
});
