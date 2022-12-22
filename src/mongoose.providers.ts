import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose'
import { DB_CONNECTION_NAME } from './constants'
import { User, UserSchema } from './modules/users/schemas/users.schema'
import {
  OneTimePassword,
  OneTimePasswordSchema,
} from './modules/one-time-password/one-time-password.schema'
import { Sequence, SequenceSchema } from './modules/sequences/sequence.schema'

export const models = [
  {
    name: User.name,
    schema: UserSchema,
  },
  {
    name: OneTimePassword.name,
    schema: OneTimePasswordSchema,
  },
  {
    name: Sequence.name,
    schema: SequenceSchema,
  },
]

export const mongooseModuleAsyncOptions: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  connectionName: DB_CONNECTION_NAME,
  useFactory: async (configService: ConfigService) => {
    return {
      uri: configService.get<string>('database.host'),
      ...configService.get<any>('database.options'),
    } as MongooseModuleAsyncOptions
  },
}
