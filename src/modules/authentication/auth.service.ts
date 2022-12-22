import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { LoginDto } from './dto/login.dto'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByPhoneNumber(username)
    if (!user) throw new BadRequestException('User does not exist')
    const passwordMatches = await bcrypt.compare(password, user.password)
    console.log(passwordMatches)
    if (!passwordMatches) throw new BadRequestException('Password is incorrect')
    return user
  }

  async login(userDto: LoginDto) {
    const user = await this.usersService.findByPhoneNumber(userDto.username)
    const tokens = await this.getTokens(
      user.objectId,
      user.phoneNumber,
      user.changedPassword,
    )
    await this.usersService.updateUserToken(
      userDto.username,
      tokens.accessToken,
    )
    return tokens
  }

  async getTokens(userId: string, username: string, changePass: boolean) {
    console.log(userId)
    const [accessToken, refreshToken, changePassword] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
      changePass,
    ])
    return {
      accessToken,
      refreshToken,
      changePassword,
    }
  }
}
