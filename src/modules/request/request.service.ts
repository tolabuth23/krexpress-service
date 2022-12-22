import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { generate } from 'shortid'
import bcrypt from 'bcrypt'
import { InjectModel } from '@nestjs/mongoose'
import random from 'lodash/random'
import { addMinutes } from 'date-fns'
import axios from 'axios'
import { RequestOtpSignupDto } from './dto/request-otp-signup.dto'
import { OneTimePasswordService } from '../one-time-password/one-time-password.service'
import { ResetPasswordDto } from './dto/reset-password.dto'
import Environment from '../../environment'
import { RequestOtpForgotPasswordDto } from './dto/request-otp-forgot-password.dto'
import { VerifyDto } from './dto/verify.dto'
import { User, UserDocument } from '../users/schemas/users.schema'
import { UserActiveEnum } from '../enum/user-active.enum'
import { OneTimePassword } from '../one-time-password/one-time-password.schema'

interface INexmo {
  to: string
  api_key: string
  api_secret: string
  from: string
  text: string
}
@Injectable()
export class RequestService {
  nexmoUrl = 'https://rest.nexmo.com/sms/json'
  phoneNumber: string
  type: string
  constructor(
    private readonly optService: OneTimePasswordService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async requestOTPSignUp(
    requestOptSignUp: RequestOtpSignupDto,
  ): Promise<OneTimePassword> {
    return await this.oneTimePasswordInstance(
      requestOptSignUp.phoneNumber,
      requestOptSignUp.code,
      UserActiveEnum.SIGNUP,
      this.getReference(),
    )
  }

  async requestOTPForgotPassword(
    requestOptForgot: RequestOtpForgotPasswordDto,
  ) {
    console.log('Check data of request opt forgot : ', requestOptForgot)
    return await this.oneTimePasswordInstance(
      requestOptForgot.phoneNumber,
      requestOptForgot.code,
      UserActiveEnum.FORGOT_PASSWORD,
      this.getReference(),
    )
  }

  async getOTP(ref: string) {
    const oneTimePassword = await this.optService.getByRef(ref)
    return oneTimePassword
  }

  async verifyOTP(body: VerifyDto) {
    await this.optService.verify(body.ref)
    return 'Verify OTP Successfully'
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const oneTimePassword = await this.optService.getByRef(resetPasswordDto.ref)
    const hashPassword = await bcrypt.hash(resetPasswordDto.password, 10)
    const phoneNumber = oneTimePassword.phoneNumber
    await this.userModel.updateOne({ phoneNumber }, { password: hashPassword })
    return 'Reset password is successfully!!'
  }

  private async oneTimePasswordInstance(
    phoneNumber: string,
    code: string,
    type: string,
    ref: string,
  ) {
    await this.optService.deleteByPhoneNumber(phoneNumber, code, type)
    const createdBody = {
      code: code,
      phoneNumber: phoneNumber,
      ref: ref,
      otp: this.getGenerateOTP(),
      type: type,
      expiredAt: addMinutes(new Date(), 4),
    }
    const oneTimePassword = await this.optService.create(createdBody)
    this.sendMessage(
      code,
      phoneNumber,
      `Reference: ${oneTimePassword.ref} \nOTP: ${oneTimePassword.otp}`,
    )
    return this.optService.getByRef(ref)
  }

  private getReference() {
    return generate().toLowerCase()
  }
  private getGenerateOTP(): string {
    return Environment.isProd() ? random(100000, 999999) : 11111
  }
  private sendMessage(code: string, phoneNumber: string, text: string) {
    const to = `${code.replace('+', '')}${phoneNumber.slice(1)}`
    const nexmo: INexmo = {
      to,
      text,
      api_key: 'ebeaffaa',
      api_secret: 'HMY6bdz4JIAVUxDs',
      from: 'KR Express',
    }
    if (Environment.isProd()) {
      axios.post(this.nexmoUrl, nexmo)
    }
    return nexmo
  }
}
