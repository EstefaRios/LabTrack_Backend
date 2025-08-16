import { Test } from '@nestjs/testing';
import { NotificacionesController } from './notificaciones.controller';
import { NotificacionesService } from './notificaciones.service';

describe('NotificacionesController', () => {
  let ctrl: NotificacionesController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [NotificacionesController],
      providers: [{
        provide: NotificacionesService,
        useValue: {
          listar: jest.fn().mockResolvedValue({ total: 0, pagina: 1, data: [] }),
          crear: jest.fn().mockResolvedValue({ id: 1 }),
          marcarLeida: jest.fn().mockResolvedValue({ id: 1, leida: true }),
          eliminar: jest.fn().mockResolvedValue({ ok: true }),
        },
      }],
    }).compile();
    ctrl = module.get(NotificacionesController);
  });

  it('lista', async () => {
    const r = await ctrl.listar({ idUsuario: 1 } as any);
    expect(r).toHaveProperty('data');
  });
});
