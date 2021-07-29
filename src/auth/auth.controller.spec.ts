import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
jest.mock('./auth.service');
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('ft auth login', async () => {
    const token = { access_token: 'token' };
    const authServiceSpy = jest
      .spyOn(authService, 'login')
      .mockResolvedValue(token);
    const result = await authController.ftAuth({ id: 1 });
    expect(authServiceSpy).toBeCalled();
    expect(result).toEqual(token);
  });
});
