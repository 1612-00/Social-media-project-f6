import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/api/user/user.repository';
import { JwtPayload } from 'src/share/auth/payloads/jwt-payload';
import { JWT_CONFIG } from '../constant.config';
import { CreateGmailAccountDto } from './dto/create-gmail-account.dto';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) {}
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    try {
      const userFound = await this.userRepository.findOneByConditionAndProtectField(
        {
          email: req.user.email,
        },
        'password',
      );
      if (!userFound) {
        const createUserDto: CreateGmailAccountDto = {
          email: req.user.email,
          password: null,
          fullName: req.user.firstName + req.user.lastName,
          isVerified: true,
        };
        await this.userRepository.create({
          ...createUserDto,
        });
      }

      const payload: JwtPayload = {
        email: req.user.email,
      };
      const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: JWT_CONFIG.secret,
        expiresIn: jwtExpiresIn,
      });
      return {
        accessToken,
        accessTokenExpire: jwtExpiresIn,
      };
    } catch (error) {
      throw new Error('Gmail login failure');
    }
  }
}
