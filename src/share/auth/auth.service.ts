import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/api/user/dto';
import { UserService } from 'src/api/user/user.service';
import { JWT_CONFIG } from 'src/config';
import { RegisterResponseDto } from './dto/register-response.dto';
import { JwtPayload } from './payloads/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, LoginResponseDto, LoginUserDto } from './dto';
import { UserRepository } from 'src/api/user/user.repository';
import { ERROR } from '../common';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/config/mail/mail.service';
import { User } from 'src/api/user/schema/UserSchema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<RegisterResponseDto> {
    const user = await this.userService.create(createUserDto);
    const payload: JwtPayload = {
      email: user.email,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_CONFIG.secret,
      expiresIn: jwtExpiresIn,
    });
    delete user.password;

    this.mailService.confirmAccount(user, accessToken);

    return {
      user,
      accessToken,
      accessTokenExpire: jwtExpiresIn,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user: User = await this.userRepository.findOneByCondition({
      email: loginUserDto.email,
    });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    const matchesPassword = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!matchesPassword) {
      throw new NotFoundException(ERROR.USERNAME_OR_PASSWORD_INCORRECT.MESSAGE);
    }

    const payload: JwtPayload = {
      email: user.email,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_CONFIG.secret,
      expiresIn: jwtExpiresIn,
    });

    // if user unauthenticated, throw an error
    if (!user.isVerified) {
      this.mailService.confirmAccount(user, accessToken);
      throw new BadRequestException(ERROR.UNAUTHENTICATED_USER.MESSAGE);
    }

    return {
      accessToken,
      accessTokenExpire: jwtExpiresIn,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user: User = await this.userRepository.findOneByCondition({
      email: forgotPasswordDto.email,
    });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }

    if (!user.isVerified) {
      throw new BadRequestException(ERROR.ACCOUNT_IS_NOT_VERIFIED.MESSAGE);
    }

    const payload: JwtPayload = {
      email: user.email,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_CONFIG.secret,
      expiresIn: jwtExpiresIn,
    });

    this.mailService.forgotPassword(user.email, accessToken);
    return 'please check your email';
  }

  async resetPassword(resetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
