import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe(' Test suite', () => {
  let service: UserService;

  const mockUserRepository = {
    findOneByCondition: jest.fn((condition) => ({ ...condition })),
    findOneByConditionAndProtectField: jest.fn((condition) => null),
    hashPassword: jest.spyOn(bcrypt, 'hashSync').mockImplementation((password) => password),
    create: jest.fn((dto) => ({
      ...dto,
      password: bcrypt.hashSync(dto.password, 10),
    })),
    findOneByConditionAndUpdate: jest.fn((condition, data) => ({ ...data })),
  };

  const mockJwtService = {
    verify: jest.fn((token) => expect.any(Object)),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('should be get user by email', () => {
    it('should return user by email', async () => {
      expect(await service.getUserByCondition({ email: 'email' })).toEqual({
        email: 'email',
      });
    });

    it('exception: user not exist', async () => {
      mockUserRepository.findOneByCondition((condition) => null);
      try {
        await service.getUserByCondition({ email: 'email' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('should be created user', () => {
    const dto = {
      email: 'nguyenducanh1.ldb@gmail.com',
      password: 'ducanh',
      fullName: 'Nguyen Duc Anh',
    };

    it('create user no exception', async () => {
      expect(await service.create(dto)).toEqual({
        ...dto,
        password: bcrypt.hashSync(dto.password, 10),
      });
    });

    it('exception: email already exist', async () => {
      mockUserRepository.findOneByConditionAndProtectField.mockResolvedValue((condition) =>
        Promise.resolve({ ...condition }),
      );
      try {
        await service.create(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('should be confirm user account', () => {
    it('confirm account no exception', async () => {
      mockUserRepository.findOneByConditionAndProtectField.mockResolvedValue((condition) =>
        Promise.resolve({ ...condition }),
      );
      expect(await service.confirmAccount('token')).toEqual('Account verified successfully');
    });

    it('exception: token invalid', async () => {
      mockJwtService.verify.mockRejectedValue(new Error());
      try {
        await service.confirmAccount('token');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('should be reset password', () => {
    const dto = { token: 'token', newPassword: 'password' };

    it('reset password no exception', async () => {
      mockJwtService.verify.mockResolvedValue((token) => expect.any(Object));
      expect(await service.resetPassword(dto)).toEqual(expect.objectContaining({ password: dto.newPassword }));
    });

    it('exception: token invalid', async () => {
      mockJwtService.verify.mockRejectedValue(new Error());
      try {
        await service.resetPassword(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
