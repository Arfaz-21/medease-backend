// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Use FRONTEND_ORIGINS env (comma separated)
  const origins = process.env.FRONTEND_ORIGINS ? process.env.FRONTEND_ORIGINS.split(',') : ['*'];
  app.enableCors({
    origin: (origin, callback) => {
      // allow non-browser callers (Postman, server-to-server) when origin is undefined
      if (!origin) return callback(null, true);
      if (origins.includes('*') || origins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
