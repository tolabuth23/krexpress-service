import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { models } from '../../mongoose.providers'
import { DB_CONNECTION_NAME } from '../../constants'
import { RequestController } from './request.controller'
import { RequestService } from './request.service'
import { UsersModule } from '../users/users.module'
import { OneTimePasswordModule } from '../one-time-password/one-time-password.module'

@Module({
  imports: [
    MongooseModule.forFeature(models, DB_CONNECTION_NAME),
    UsersModule,
    OneTimePasswordModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
