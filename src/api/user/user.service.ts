import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto';
import { ERROR } from 'src/share/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/config';
import { User } from './schema/UserSchema';
import { MailService } from 'src/config/mail/mail.service';
import { ResetPasswordDto } from 'src/share/auth/dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly mailService: MailService) {}

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
    const jwtService = new JwtService({
      secret: JWT_CONFIG.secret,
      signOptions: {
        expiresIn: JWT_CONFIG.expiresIn,
      },
    });
    // Verify token
    const user = await jwtService.verify(token);

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
    const jwtService = new JwtService({
      secret: JWT_CONFIG.secret,
      signOptions: {
        expiresIn: JWT_CONFIG.expiresIn,
      },
    });
    // Verify token
    const user = await jwtService.verify(resetPasswordDto.token);

    const hash = bcrypt.hashSync(resetPasswordDto.newPassword, 10);

    const userUpdated = await this.userRepository.findOneByConditionAndUpdate(
      { email: user.email },
      { password: hash },
    );

    return userUpdated;
  }
}
