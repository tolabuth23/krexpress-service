import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { models } from '../../mongoose.providers'
import { DB_CONNECTION_NAME } from '../../constants'
import { OneTimePasswordModule } from '../one-time-password/one-time-password.module'
import { SequenceModule } from '../sequences/sequence.module'

@Module({
  imports: [
    MongooseModule.forFeature(models, DB_CONNECTION_NAME),
    OneTimePasswordModule,
    SequenceModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
