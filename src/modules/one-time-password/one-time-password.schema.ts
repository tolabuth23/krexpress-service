import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type OneTimePasswordDocument = OneTimePassword & Document
@Schema()
export class OneTimePassword {
  @Prop({
    type: String,
    max: 8,
    required: true,
    index: true,
  })
  ref: string

  @Prop({
    type: String,
    max: 8,
    required: true,
  })
  otp: string

  @Prop({
    type: String,
    min: 9,
    required: true,
  })
  phoneNumber: string

  @Prop({
    type: String,
    min: 2,
    required: true,
  })
  code: string

  @Prop({
    type: String,
    required: true,
  })
  type: string

  @Prop({
    type: Date,
    required: true,
  })
  expiredAt: Date

  @Prop({
    type: Date,
    default: new Date(),
    expire: 1200,
  })
  createdAt: Date

  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified: boolean

  @Prop({
    type: Object,
    default: {},
  })
  meta: object
}

export const OneTimePasswordSchema =
  SchemaFactory.createForClass(OneTimePassword)
