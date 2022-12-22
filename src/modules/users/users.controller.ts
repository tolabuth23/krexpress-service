import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import shortid from 'shortid'
import bcrypt from 'bcrypt'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/users.schema'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserValidationPipe } from './pipes/create-user-validation.pipe'
import { UpdateUserValidationPipe } from './pipes/update-user-validation.pipe'

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private logger = new Logger(UsersController.name)
  @Post('/users')
  async createUser(
    @Body(CreateUserValidationPipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    try {
      const { password } = createUserDto
      createUserDto.objectId = await this.usersService.getUserObjectId()
      createUserDto.password = await bcrypt.hash(password, 10)
      return await this.usersService.createUser(createUserDto)
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  @Put('/users/:objectId')
  async updateUser(
    @Param('objectId') objectId: string,
    @Body(UpdateUserValidationPipe)
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      return this.usersService.updateUser(objectId, updateUserDto)
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  @Get('/users')
  async getListUsers(): Promise<User> {
    return this.usersService.getListUsers()
  }

  @Get('/users/:objectId')
  async getOneUser(@Param('objectId') objectId: string): Promise<UserDocument> {
    return this.usersService.getOneUser(objectId)
  }

  @Put('/users/:objectId/reset-password')
  async resetPasswordUser(@Param('objectId') objectId: string): Promise<any> {
    const plainPassword = shortid.generate()
    const hash = await bcrypt.hash(plainPassword, 10)
    return await this.usersService.resetPasswordUser(objectId, hash, true)
  }
}
