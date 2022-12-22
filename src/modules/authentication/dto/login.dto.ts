import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    example: 'local',
  })
  strategy: string

  @ApiProperty({
    example: '09223232',
  })
  username: string

  @ApiProperty({
    example: '11111',
  })
  password: string
}
