import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { UsersService } from '../users.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { OneTimePasswordService } from '../../one-time-password/one-time-password.service'

@Injectable()
export class CreateUserValidationPipe implements PipeTransform {
  @Inject() private readonly usersService: UsersService
  @Inject() private readonly otpService: OneTimePasswordService
  async transform(body: CreateUserDto): Promise<CreateUserDto> {
    const userExists = await this.usersService.findByPhoneNumber(
      body.phoneNumber,
    )
    const email = await this.usersService.findByEmail(body.email)
    if (userExists) {
      throw new BadRequestException(`phone number is already to use`)
    }
    if (email) {
      throw new BadRequestException('email is already to used')
    }

    if (!/[a-zA-Z\d#$^+=!*()@%&.,]$/.test(body.password)) {
      throw new BadRequestException('Password invalid')
    }
    const haveDefaultAddress = body.addresses.filter(
      (address) => address.isDefault,
    ).length
    if (haveDefaultAddress > 1) {
      throw new BadRequestException('default address just have only one')
    }
    return body
  }
}
