import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto';
import { User, UserDocument } from './schema/UserSchema';

export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return this.userModel.create(createUserDto);
    } catch (error) {
      throw new Error('User created failed');
    }
  }

  findOneByCondition(condition: object) {
    return this.userModel.findOne(condition);
  }

  /**
   * @description Find one and delete fieldProtect
   */
  findOneByConditionAndProtectField(condition: object, fieldProtect: string) {
    return this.userModel.findOne(condition).select(`-${fieldProtect}`);
  }

  findOneByConditionAndUpdate(condition: object, dataUpdate: object) {
    return this.userModel.findOneAndUpdate(condition, { $set: dataUpdate }, { new: true });
  }
}
