import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtSecretEnum } from '../enum/jwt-secret.enum'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtSecretEnum.SECRET,
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }
  }
}