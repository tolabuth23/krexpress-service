import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { OneTimePasswordService } from '../../one-time-password/one-time-password.service'
import { PHONE_CODES } from '../../../constants'
import { RequestOtpForgotPasswordDto } from '../dto/request-otp-forgot-password.dto'

@Injectable()
export class RequestOtpForgotPasswordValidationPipe implements PipeTransform {
  @Inject() private readonly otpService: OneTimePasswordService
  async transform(
    body: RequestOtpForgotPasswordDto,
  ): Promise<RequestOtpForgotPasswordDto> {
    const user = await this.otpService.findByPhoneNumber(body.phoneNumber)
    if (!user) {
      throw new BadRequestException(`phone number not found, please try again`)
    }
    const isAvailable = PHONE_CODES.includes(body.code)
    if (!isAvailable) {
      throw new BadRequestException(
        `${body.code} not available, please contact admin`,
      )
    }
    return body
  }
}
