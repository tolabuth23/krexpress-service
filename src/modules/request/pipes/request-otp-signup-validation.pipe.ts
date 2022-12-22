import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { RequestOtpSignupDto } from '../dto/request-otp-signup.dto'
import { OneTimePasswordService } from '../../one-time-password/one-time-password.service'
import { PHONE_CODES } from '../../../constants'

@Injectable()
export class RequestOtpSignupValidationPipe implements PipeTransform {
  @Inject() private readonly otpService: OneTimePasswordService
  async transform(body: RequestOtpSignupDto): Promise<RequestOtpSignupDto> {
    const user = await this.otpService.findByPhoneNumber(body.phoneNumber)
    if (user) {
      throw new BadRequestException(`Phone number is already to used`)
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
