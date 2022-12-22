import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { Model } from 'mongoose'
import { isPast } from 'date-fns'
import { VerifyDto } from '../dto/verify.dto'
import { InjectModel } from '@nestjs/mongoose'
import { OneTimePassword } from '../../one-time-password/one-time-password.schema'

@Injectable()
export class VerifyValidationPipes implements PipeTransform {
  constructor(
    @InjectModel(OneTimePassword.name) private otpModel: Model<OneTimePassword>,
  ) {}
  async transform(body: VerifyDto): Promise<VerifyDto> {
    const oneTimePassword = await this.otpModel.findOne(body)
    if (!oneTimePassword) {
      throw new BadRequestException('opt not found')
    }
    if (oneTimePassword.isVerified) {
      throw new BadRequestException('opt is already to used')
    }
    if (isPast(oneTimePassword.expiredAt)) {
      throw new BadRequestException('opt is expired')
    }
    return body
  }
}
