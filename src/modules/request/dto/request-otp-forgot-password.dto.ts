import { ApiProperty } from '@nestjs/swagger'

export class RequestOtpForgotPasswordDto {
  @ApiProperty({
    example: '0923434443',
  })
  phoneNumber: string

  @ApiProperty({
    example: '+66',
  })
  code: string
}
