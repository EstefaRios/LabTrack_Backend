import { Test } from '@nestjs/testing';
import { AuditController } from './auditoria.controller';
import { AuditService } from './auditoria.service';

describe('AuditController', () => {
  let ctrl: AuditController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        {
          provide: AuditService,
          useValue: {
            listar: jest
              .fn()
              .mockResolvedValue({ total: 0, pagina: 1, data: [] }),
          },
        },
      ],
    }).compile();
    ctrl = module.get(AuditController);
  });

  it('lista', async () => {
    const r = await ctrl.listar({} as any);
    expect(r).toHaveProperty('data');
  });
});
