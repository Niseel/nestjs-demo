import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

/**
 *
 * Add Module Prisma (global module)
 **/
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add midleware HERE!

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT ?? 8000)
}
bootstrap()
