import { Body, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  OneTimePassword,
  OneTimePasswordDocument,
} from './one-time-password.schema'
import { CreateOptDto } from './dto/create-opt-dto'

@Injectable()
export class OneTimePasswordService {
  constructor(
    @InjectModel(OneTimePassword.name)
    private otpModel: Model<OneTimePasswordDocument>,
  ) {}
  async deleteByPhoneNumber(phoneNumber: string, type: string, code = '+66') {
    return this.otpModel.deleteMany({
      phoneNumber,
      type,
      code,
      isVerified: false,
    })
  }

  async getByRef(ref: string): Promise<OneTimePasswordDocument> {
    return this.otpModel.findOne({ ref }).select({
      phoneNumber: 1,
      code: 1,
      ref: 1,
      type: 1,
      isVerified: 1,
      expiredAt: 1,
    })
  }

  async verify(ref: string) {
    return this.otpModel.updateOne({ ref }, { isVerified: true })
  }
  async create(createDto: CreateOptDto) {
    return this.otpModel.create(createDto)
  }
  async findByPhoneNumber(phoneNumber: string): Promise<OneTimePassword> {
    return this.otpModel.findOne({ phoneNumber })
  }
}
