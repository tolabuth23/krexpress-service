import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

export const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('Kr-Express API')
    .setDescription(
      'Kr-Express API Document ส่งของที่ยาวไกลลลลลลลลลลลลลลลลลลลลลลลลลลล',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('')
    .addServer('/api')
    .addServer(`/api/${process.env.PROVIDER || ''}`)
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(`${process.env.PROVIDER || ''}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
}
