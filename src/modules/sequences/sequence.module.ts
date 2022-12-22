import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SequenceService } from './sequence.service'
import { DB_CONNECTION_NAME } from '../../constants'
import { models } from '../../mongoose.providers'

@Module({
  imports: [MongooseModule.forFeature(models, DB_CONNECTION_NAME)],
  controllers: [],
  providers: [SequenceService],
  exports: [SequenceService],
})
export class SequenceModule {}
