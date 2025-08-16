import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: { loginPaciente: jest.fn().mockResolvedValue({ access_token: 'x' }) } }],
    }).compile();
    controller = module.get(AuthController);
  });

  it('login-paciente retorna token', async () => {
    const res = await controller.login({ tipo: 'CC', numero: '1', fechaNacimiento: '2000-01-01' } as any, {} as any);
    expect(res).toHaveProperty('access_token');
  });
});
