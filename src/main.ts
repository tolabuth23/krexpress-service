import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import { Logger } from '@nestjs/common'
import { setupSwagger } from './swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger()
  if (process.env.ENABLE_SWAGGER_API_DOCUMENT === '1') {
    setupSwagger(app)
  }

  await app.listen(3000)
}
bootstrap()
