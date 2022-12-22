import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import padStart from 'lodash/padStart'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/users.schema'
import { UpdateUserDto } from './dto/update-user.dto'
import { SequenceService } from '../sequences/sequence.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    private readonly sequenceService: SequenceService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersModel.create(createUserDto)
  }
  async findById(id: string): Promise<User> {
    return this.usersModel.findOne({ _id: id }).lean()
  }

  async updateUserToken(phoneNumber: string, token: string) {
    return this.usersModel.updateOne({ phoneNumber }, { token: token })
  }
  async updateUser(
    objectId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersModel
      .findOneAndUpdate(
        { objectId: objectId },
        { $set: updateUserDto },
        { new: true },
      )
      .lean()
  }

  async getListUsers(): Promise<UserDocument> {
    const page = 1
    const perPage = 20
    return this.usersModel
      .find()
      .select({ password: 0, token: 0 })
      .skip((page - 1) * +perPage)
      .limit(+perPage)
      .sort({ createdAt: -1 })
      .lean()
  }

  async getOneUser(objectId: string): Promise<UserDocument> {
    const user = await this.usersModel.findOne({ objectId })
    if (!user) throw new BadRequestException('User not have !!!')
    return user
  }

  async resetPasswordUser(
    objectId: string,
    password: string,
    changedPassword: boolean,
  ): Promise<any> {
    await this.usersModel.updateOne({ objectId }, { password, changedPassword })
    const payload = {
      objectId,
      newPassword: password,
    }
    return payload
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return this.usersModel
      .findOne({ phoneNumber })
      .select({ password: 0 })
      .lean()
  }
  async findByObjectId(objectId: string): Promise<UserDocument | undefined> {
    return this.usersModel.findOne({ objectId }).select({
      token: 0,
      password: 1,
    })
  }
  async findByUsername(username: string): Promise<UserDocument | undefined> {
    const query = {
      $or: [{ phoneNumber: username }, { objectId: username }],
    }
    return this.usersModel
      .findOne(query)
      .select({
        changedPassword: 1,
        password: 1,
      })
      .lean()
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersModel.findOne({ email })
  }
  async getUserObjectId() {
    const key = 'userObjectId'
    const prefix = 'KR'
    const sequence = await this.sequenceService.getNextSequence(key)
    const pad = padStart(sequence.value, 8, '0')
    return `${prefix}-${pad}`
  }
}
