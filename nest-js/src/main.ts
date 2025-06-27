import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend integration
  app.enableCors();
  
  // Global prefix for API routes
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log('User Management Microservice is running on http://localhost:3000');
}
bootstrap();