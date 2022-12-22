import { ApiProperty } from '@nestjs/swagger'

export class VerifyDto {
  @ApiProperty({
    example: '2334545',
  })
  ref: string

  @ApiProperty({
    example: '353545',
  })
  otp: string
}
