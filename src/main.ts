import fastifyCookie from '@fastify/cookie'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);
  app.register(fastifyCookie, {
    secret: configService.get('COOKIE_SECRET') as string,
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors({
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS',
      'PATCH',
      'HEAD',
      'CONNECT',
      'TRACE',
    ],
    origin: ['http://localhost:5173'],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 4200, '0.0.0.0');
}
bootstrap();