import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import configuration from '../../config/configuration'
import { mongooseModuleAsyncOptions } from '../../mongoose.providers'
import { UsersModule } from '../users/users.module'
import { RequestModule } from '../request/request.module'
import { AuthModule } from '../authentication/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    UsersModule,
    AuthModule,
    RequestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
