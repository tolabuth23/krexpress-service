import { IsNotEmpty, IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { Address, Provider } from '../schemas/users.schema'

export class CreateUserDto {
  @ApiProperty({
    example: 'tola@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'tolabuth',
  })
  @IsNotEmpty()
  @IsString()
  displayName: string

  @ApiProperty({
    example: [
      {
        name: 'tola buth',
        phone: '0931516482',
        province: 'Ubon Ratchathani',
        subDistrict: 'Amphoe Mueang',
        district: 'Nai Mueang',
        postCode: '43000',
        description: 'Student',
        location: 'URBU',
        isDefault: false,
      },
    ],
  })
  @IsNotEmpty()
  addresses: Address[]

  objectId: string
  @ApiProperty({
    example: '0931516482',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string

  @ApiProperty({
    example: '11111',
  })
  @IsNotEmpty()
  password: string

  @ApiProperty({
    example: Date.now(),
  })
  @IsNotEmpty()
  @IsString()
  latestLogin: Date
  @ApiProperty({})
  primaryGoodsType?: Types.ObjectId

  @ApiProperty({
    example: { line: { id: 'facebook' } },
  })
  @IsNotEmpty()
  provider: Provider

  @ApiProperty({
    example: false,
  })
  @IsNotEmpty()
  changedPassword: boolean
}
