import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe(' Test suite', () => {
  let service: UserService;

  const mockUserRepository = {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be created user', async () => {
    const dto = {
      email: 'nguyenducanh1.ldb@gmail.com',
      password: 'ducanh',
      fullName: 'Nguyen Duc Anh',
    };
    expect(await service.create(dto)).toEqual({
      ...dto,
      password: bcrypt.hashSync(dto.password, 10),
    });
  });

  it('should be confirm user account', async () => {
    mockUserRepository.findOneByConditionAndProtectField.mockResolvedValue((condition) => Promise.resolve({}));
    expect(await service.confirmAccount('token')).toEqual('Account verified successfully');
  });

  it('should be reset password', async () => {
    const dto = { token: 'token', newPassword: 'password' };
    expect(await service.resetPassword(dto)).toEqual(expect.objectContaining({ password: dto.newPassword }));
  });
});
