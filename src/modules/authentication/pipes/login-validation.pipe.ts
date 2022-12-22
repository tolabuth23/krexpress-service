import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { LoginDto } from '../dto/login.dto'
import { STRATEGIES } from '../../../constants'

@Injectable()
export class VerifyValidationPipes implements PipeTransform {
  async transform(body: LoginDto): Promise<LoginDto> {
    const isAvailable = STRATEGIES.includes(body.strategy)
    if (isAvailable) {
      throw new BadRequestException("strategy isn't available")
    }
    return body
  }
}
