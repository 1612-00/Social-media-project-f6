import * as bcrypt from 'bcrypt';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ERROR } from '../../share/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './schema/UserSchema';
import { ResetPasswordDto } from '../../share/auth/dto';
import { UserRole } from './role/role.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) {}

  async getUserById(id: string) {
    const userFound = await this.userRepository.getUserById(id);
    if (!userFound) throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    delete userFound.password;
    return userFound;
  }

  async getUserByCondition(condition: object) {
    const userFound = await this.userRepository.findOneByCondition(condition);
    if (!userFound) throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    return userFound;
  }

  async getOtherUserById(id: string) {
    const user = await this.getUserById(id);
    if (!user.isVerified) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const userFound = await this.userRepository.findOneByConditionAndProtectField(
      {
        email: createUserDto.email,
      },
      'password',
    );
    if (userFound) throw new BadRequestException(ERROR.EMAIL_ALREADY_EXIST.MESSAGE);

    const passwordHash = bcrypt.hashSync(createUserDto.password, 10);
    const userCreated = await this.userRepository.create({
      ...createUserDto,
      password: passwordHash,
    });

    return userCreated;
  }

  async confirmAccount(token: string) {
    // Verify token
    const user = await this.jwtService.verify(token);

    // Token valid
    const userFound: User = await this.userRepository.findOneByConditionAndProtectField(
      {
        email: user.email,
        isVerified: false,
      },
      'password',
    );
    if (!userFound) throw new NotFoundException(ERROR.CONFIRM_ACCOUNT_FAILURE.MESSAGE);

    // Change state to true
    const userUpdated = await this.userRepository.findOneByConditionAndUpdate(
      { email: user.email },
      { isVerified: true },
    );
    if (userUpdated.isVerified) {
      return 'Account verified successfully';
    } else {
      throw new NotFoundException(ERROR.CONFIRM_ACCOUNT_FAILURE.MESSAGE);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Verify token
    const user = await this.jwtService.verify(resetPasswordDto.token);

    const hash = bcrypt.hashSync(resetPasswordDto.newPassword, 10);

    const userUpdated = await this.userRepository.findOneByConditionAndUpdate(
      { email: user.email },
      { password: hash },
    );

    return userUpdated;
  }

  async updateMyInfo(id: string, updateUserDto: UpdateUserDto) {
    const userUpdated = await this.userRepository.findOneByIdAndUpdate(id, updateUserDto);
    return userUpdated;
  }

  async deleteUser(id: string, myId: string) {
    if (id.includes(myId)) throw new BadRequestException(ERROR.DONT_INTERACTIVE_MYSELF.MESSAGE);

    const userFound = await this.userRepository.getUserById(id);

    if (!userFound) throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);

    if (userFound.role.includes(UserRole.Admin)) throw new ForbiddenException(ERROR.DONT_PERMISSION_ACCESS.MESSAGE);

    const userDeleted = await this.userRepository.findOneByIdAndDelete(id);
    return userDeleted;
  }
}
