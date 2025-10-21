import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);

  const config = new DocumentBuilder()
  .setTitle("Students RESTful API")
  .setDescription("Students management backend")
  .setVersion("1.0")
  .addBearerAuth(
    {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "enter jwt token",
      in: "header"
    },
    'JWT-auth'
  )
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)
}
void bootstrap();
