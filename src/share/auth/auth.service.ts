import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../../api/user/dto';
import { UserService } from '../../api/user/user.service';
import { JWT_CONFIG } from '../../config';
import { RegisterResponseDto } from './dto/register-response.dto';
import { JwtPayload } from './payloads/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, LoginResponseDto, LoginUserDto } from './dto';
import { ERROR } from '../common';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../config/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<RegisterResponseDto> {
    const user = await this.userService.create(createUserDto);
    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_CONFIG.secret,
      expiresIn: jwtExpiresIn,
    });
    delete user.password;

    const sentMailConfirm = this.mailService.confirmAccount(user, accessToken);

    if (!sentMailConfirm) throw new ForbiddenException(ERROR.SEND_MAIL_FAILURE.MESSAGE);

    return {
      user,
      accessToken,
      accessTokenExpire: jwtExpiresIn,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByCondition({
      email: loginUserDto.email,
    });
    if (!user.password) {
      throw new NotFoundException(ERROR.USERNAME_OR_PASSWORD_INCORRECT.MESSAGE);
    }
    const matchesPassword = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!matchesPassword) {
      throw new NotFoundException(ERROR.USERNAME_OR_PASSWORD_INCORRECT.MESSAGE);
    }

    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_CONFIG.secret,
      expiresIn: jwtExpiresIn,
    });

    // if user unauthenticated, throw an error
    if (!user.isVerified) {
      const sentMailConfirm = this.mailService.confirmAccount(user, accessToken);
      if (!sentMailConfirm) throw new ForbiddenException(ERROR.SEND_MAIL_FAILURE.MESSAGE);

      throw new BadRequestException(ERROR.UNAUTHENTICATED_USER.MESSAGE);
    }

    return {
      accessToken,
      accessTokenExpire: jwtExpiresIn,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.getUserByCondition({
      email: forgotPasswordDto.email,
    });

    if (!user.isVerified) {
      throw new BadRequestException(ERROR.ACCOUNT_IS_NOT_VERIFIED.MESSAGE);
    }

    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_CONFIG.secret,
      expiresIn: jwtExpiresIn,
    });

    const sentMailConfirm = this.mailService.forgotPassword(user.email, accessToken);
    if (!sentMailConfirm) throw new ForbiddenException(ERROR.SEND_MAIL_FAILURE.MESSAGE);
    return { status: 200, message: 'please check your email' };
  }

  async resetPassword(resetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
