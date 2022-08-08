import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto';
import { User, UserDocument } from './schema/UserSchema';

export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto) {
    try {
      return this.userModel.create(createUserDto);
    } catch (error) {
      throw new Error('User created failed');
    }
  }

  getUserById(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  findOneByCondition(condition: object) {
    return this.userModel.findOne(condition).exec();
  }

  /**
   * @description Find one and delete fieldProtect
   */
  findOneByConditionAndProtectField(condition: object, fieldProtect: string) {
    return this.userModel.findOne(condition).select(`-${fieldProtect}`).exec();
  }

  findOneByIdAndUpdate(id: string, dataUpdate: object) {
    return this.userModel.findByIdAndUpdate(id, { $set: dataUpdate }, { new: true }).exec();
  }

  findOneByConditionAndUpdate(condition: object, dataUpdate: object) {
    return this.userModel.findOneAndUpdate(condition, { $set: dataUpdate }, { new: true }).exec();
  }

  findOneByIdAndDelete(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
