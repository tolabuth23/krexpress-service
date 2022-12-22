import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { UsersService } from '../users.service'
import { UpdateUserDto } from '../dto/update-user.dto'
import { DEALER, USER } from '../../../constants'

@Injectable()
export class UpdateUserValidationPipe implements PipeTransform {
  @Inject() private readonly usersService: UsersService
  async transform(body: UpdateUserDto): Promise<UpdateUserDto> {
    const user = await this.usersService.findByPhoneNumber(body.phoneNumber)
    if (user) {
      throw new BadRequestException('phone number is already to used')
    }

    if (![USER, DEALER].includes(body.level)) {
      throw new BadRequestException('level not match')
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
