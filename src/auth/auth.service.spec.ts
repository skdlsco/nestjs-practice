import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
jest.mock('@nestjs/jwt');
jest.mock('src/user/user.service');
describe('AuthService', () => {
  let authservice: AuthService;
  let userService: UserService;
  let fakeUser: User = new User();
  let fakeUserToken;
  const jwtService = {
    sign(payload: any) {
      return payload;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();
    authservice = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    fakeUser.id = 1;
    fakeUser.nickname = 'tester';
    fakeUserToken = {
      access_token: { id: fakeUser.id },
    };
  });

  it('should be defined', () => {
    expect(authservice).toBeDefined();
  });

  it('Jwt 토큰을 성공적으로 발급한다.', async () => {
    const token = await authservice.sign(fakeUser);
    expect(token).toStrictEqual(fakeUserToken);
  });

  it('jwt Dto가 들어왔을 때 알맞은 유저를 반환한다.', async () => {
    const userServiceGetSpy = jest
      .spyOn(userService, 'getUserById')
      .mockResolvedValue(fakeUser);
    const result = await authservice.validate({ id: fakeUser.id });
    expect(userServiceGetSpy).toHaveBeenCalledWith(fakeUser.id);
    expect(result).toStrictEqual(fakeUser);
  });

  describe('로그인', () => {
    it('이미 존재하는 유저가 로그인을 시도', async () => {
      const userServiceGetSpy = jest
        .spyOn(userService, 'getUserById')
        .mockResolvedValue(fakeUser);
      const userServiceCreateSpy = jest.spyOn(userService, 'createUser');

      const result = await authservice.login(fakeUser);
      expect(userServiceGetSpy).toHaveBeenCalledWith(fakeUser.id);
      expect(userServiceCreateSpy).not.toHaveBeenCalled();
      expect(result).toStrictEqual(fakeUserToken);
    });

    it('새로운 유저가 로그인을 시도', async () => {
      const userServiceGetSpy = jest
        .spyOn(userService, 'getUserById')
        .mockRejectedValue(null);
      const userServiceCreateSpy = jest.spyOn(userService, 'createUser');

      const result = await authservice.login(fakeUser);
      expect(userServiceCreateSpy).toHaveBeenCalled();
      expect(result).toStrictEqual(fakeUserToken);
    });
  });
});
