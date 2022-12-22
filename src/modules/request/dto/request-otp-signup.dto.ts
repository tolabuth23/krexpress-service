import { ApiProperty } from '@nestjs/swagger'

export class RequestOtpSignupDto {
  @ApiProperty({
    example: '0834534543',
  })
  phoneNumber: string

  @ApiProperty({
    example: '+66',
  })
  code: string
}
