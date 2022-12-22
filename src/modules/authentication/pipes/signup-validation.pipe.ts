import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { isPast } from 'date-fns'
import { UsersService } from '../../users/users.service'
import { OneTimePasswordService } from '../../one-time-password/one-time-password.service'
import { UserActiveEnum } from '../../enum/user-active.enum'
import { SignUpUserDto } from '../dto/sign-up-user.dto'

@Injectable()
export class SignupValidationPipe implements PipeTransform {
  @Inject() private readonly usersService: UsersService
  @Inject() private readonly otpService: OneTimePasswordService
  async transform(body: SignUpUserDto): Promise<SignUpUserDto> {
    const oneTimePassword = await this.otpService.getByRef(body.ref)
    if (!oneTimePassword) {
      throw new BadRequestException('data not found')
    }
    if (oneTimePassword.type !== UserActiveEnum.SIGNUP) {
      throw new BadRequestException('data is invalid type')
    }
    if (oneTimePassword.phoneNumber !== body.phoneNumber) {
      throw new BadRequestException('data not match')
    }
    if (!oneTimePassword.isVerified) {
      throw new BadRequestException("data isn't verify ")
    }
    if (isPast(oneTimePassword.expiredAt)) {
      throw new BadRequestException('otp is expired')
    }
    const userExists = await this.usersService.findByPhoneNumber(
      body.phoneNumber,
    )
    if (userExists) {
      throw new BadRequestException(`phone number is already to use`)
    }
    const email = await this.usersService.findByEmail(body.email)
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
