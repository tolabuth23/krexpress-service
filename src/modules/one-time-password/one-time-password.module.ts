import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OneTimePasswordService } from './one-time-password.service'
import { models } from '../../mongoose.providers'
import { DB_CONNECTION_NAME } from '../../constants'

@Module({
  imports: [MongooseModule.forFeature(models, DB_CONNECTION_NAME)],
  providers: [OneTimePasswordService],
  exports: [OneTimePasswordService],
})
export class OneTimePasswordModule {}
