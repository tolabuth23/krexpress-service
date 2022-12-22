import { CacheModule, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtSecretEnum } from './enum/jwt-secret.enum'
import { OneTimePasswordModule } from '../one-time-password/one-time-password.module'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    UsersModule,
    OneTimePasswordModule,
    PassportModule,
    JwtModule.register({
      secret: JwtSecretEnum.SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get<string>('database.redis.redisHost'),
        port: configService.get<number>('database.redis.redisPort'),
        ttl: configService.get<number>('database.redis.redisTtl'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
