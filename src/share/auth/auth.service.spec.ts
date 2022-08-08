import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserService } from '../../api/user/user.service';
import { MailService } from '../../config/mail/mail.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

describe(' Test suite', () => {
  let service: AuthService;

  const mockUserService = {
    create: jest.fn((dto) => ({ ...dto })),
    getUserByEmail: jest.fn((email) => ({ email, isVerified: true })),
    hashPassword: jest.spyOn(bcrypt, 'compareSync').mockImplementation((passwordInput, hashPassword) => true),
  };
  const mockJwtService = {
    signAsync: jest.fn((payload, {}) => expect.any(String)),
  };
  const mockMailService = {
    confirmAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('should register user', () => {
    const dto = {
      email: 'nguyenducanh.ldb@gmail.com',
      password: 'ducanh',
      fullName: 'Duc Anh Nguyen',
    };
    it('should register user no exception', async () => {
      expect(await service.register(dto)).toEqual({
        user: { email: dto.email, fullName: dto.fullName },
        accessToken: expect.any(String),
        accessTokenExpire: expect.any(Number),
      });
    });
  });

  describe('should login user', () => {
    const dto = {
      email: 'nguyenducanh.ldb@gmail.com',
      password: 'ducanh',
    };
    it('should login user', async () => {
      expect(await service.login(dto)).toEqual({
        accessToken: expect.any(String),
        accessTokenExpire: expect.any(Number),
      });
    });
    it('should user account not verify', async () => {
      mockUserService.getUserByEmail((email) => ({ email, isVerified: false }));
      try {
        expect(await service.login(dto)).toThrow(BadRequestException);
      } catch (error) {}
    });
  });
});
