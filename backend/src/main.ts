import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Course Project API')
    .setDescription('API documentation for the course project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173', 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']

  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
