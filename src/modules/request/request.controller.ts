import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RequestService } from './request.service'
import { RequestOtpSignupDto } from './dto/request-otp-signup.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { RequestOtpForgotPasswordDto } from './dto/request-otp-forgot-password.dto'
import { VerifyDto } from './dto/verify.dto'
import { RequestOtpSignupValidationPipe } from './pipes/request-otp-signup-validation.pipe'
import { RequestOtpForgotPasswordValidationPipe } from './pipes/request-otp-forgot-password-validation.pipe'
import { VerifyValidationPipes } from './pipes/verify-validation.pipes'
import { ResetPasswordValidationPipe } from './pipes/reset-password-validation.pipe'
import { OneTimePassword } from '../one-time-password/one-time-password.schema'

@ApiTags('Requests')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}
  @Post('/otp/sign-up')
  async requestOTPSignUp(
    @Body(RequestOtpSignupValidationPipe) body: RequestOtpSignupDto,
  ): Promise<OneTimePassword> {
    return this.requestService.requestOTPSignUp(body)
  }
  @Post('/otp/forgot-password')
  async requestOTPForgotPassword(
    @Body(RequestOtpForgotPasswordValidationPipe)
    body: RequestOtpForgotPasswordDto,
  ) {
    return this.requestService.requestOTPForgotPassword(body)
  }

  @Post('/otp/reset-password')
  async requestOTPResetPassword(
    @Body(RequestOtpForgotPasswordValidationPipe)
    body: RequestOtpForgotPasswordDto,
  ) {
    return this.requestService.requestOTPForgotPassword(body)
  }

  @Put('/otp/verify')
  async requestOTPVerify(@Body(VerifyValidationPipes) body: VerifyDto) {
    return this.requestService.verifyOTP(body)
  }

  @Post('/reset-password')
  async requestResetPassword(
    @Body(ResetPasswordValidationPipe) body: ResetPasswordDto,
  ) {
    return this.requestService.resetPassword(body)
  }
  @Get('/otp/:ref')
  async requestOtpByRef(@Param('ref') ref: string) {
    return this.requestService.getOTP(ref)
  }
}
