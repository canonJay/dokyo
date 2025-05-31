import fastifyCookie from '@fastify/cookie'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
  const configService = app.get(ConfigService)
  app.register(fastifyCookie, {
    secret: configService.get('COOKIE_SECRET') as string
  });

	app.enableCors({
		origin: ['http://localhost:5173'],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 4200, '0.0.0.0');
}
bootstrap();
