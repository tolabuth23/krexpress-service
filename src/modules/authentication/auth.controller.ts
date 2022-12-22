import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger'
import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common'
import bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { SignUpUserDto } from './dto/sign-up-user.dto'
import { User} from '../users/schemas/users.schema'
import { SignupValidationPipe } from './pipes/signup-validation.pipe'

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  private readonly logger = new Logger(AuthController.name)
  @Post('/users/sign-up')
  async signUp(
    @Body(SignupValidationPipe) signUpUserDto: SignUpUserDto,
  ): Promise<User> {
    try {
      const { password } = signUpUserDto
      const hashedPassword = await bcrypt.hash(password, 10)
      return this.userService.createUser({
        ...signUpUserDto,
        password: hashedPassword,
      })
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  @Post('/authentication')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiProperty({
    type: LoginDto,
  })

  @Post('auth/login')
  async login(@Body() body: LoginDto) {
    console.log(body)
    return this.authService.login(body)
  }
}
