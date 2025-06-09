import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT ?? 5000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true, validateCustomDecorators: true }));
  const document = new DocumentBuilder()
    .setTitle('Sboard API')
    .setDescription('Документация по API Sboard')
    .setVersion('1.0.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

void bootstrap();
