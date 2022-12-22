import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ResetPasswordDto {
  @ApiProperty({
    example: '3434sf34',
  })
  @IsNotEmpty()
  @IsString()
  ref: string

  @ApiProperty({
    example: '34354',
  })
  password: string
}
