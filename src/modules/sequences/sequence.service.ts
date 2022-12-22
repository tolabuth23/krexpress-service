import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Sequence, sequenceDocument } from './sequence.schema'

@Injectable()
export class SequenceService {
  constructor(
    @InjectModel(Sequence.name) private sequenceModel: Model<sequenceDocument>,
  ) {}
  async getSequence(key: string) {
    const seq = await this.sequenceModel.findOne({ key })
    if (seq) {
      return seq
    }
    return this.getNextSequence(key)
  }
  async getNextSequence(key: string) {
    console.log(key)
    const query = { key }
    const update = { $inc: { value: 1 } }
    const option = { new: true }
    return this.sequenceModel.findOneAndUpdate(query, update, option).lean()
  }
}
