import { ApiProperty } from '@nestjs/swagger'

export class CreateOptDto {
  @ApiProperty({
    example: 'ref02',
  })
  ref: string

  @ApiProperty({
    example: '5083',
  })
  otp: string
  @ApiProperty({
    example: '093223423',
  })
  phoneNumber: string
  @ApiProperty({
    example: '4300',
  })
  code: string
  @ApiProperty({
    example: 'sign_up',
  })
  type: string
  @ApiProperty({
    example: Date.now(),
  })
  expiredAt: Date
}
