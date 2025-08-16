import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  Like,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Auditoria } from './auditoria.modelo';
import { ListaAuditoriaQuery } from './auditoria.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Auditoria) private repo: Repository<Auditoria>,
  ) {}

  async log(entry: Partial<Auditoria>) {
    return this.repo.save(this.repo.create(entry));
  }

  async listar(q: ListaAuditoriaQuery) {
    const where: FindOptionsWhere<Auditoria> = {};

    // Filtros de texto
    if (q.accion) where.accion = Like(`%${q.accion}%`);
    if (q.nombreTabla) where.tableName = Like(`%${q.nombreTabla}%`);
    if (q.idUsuario) where.idUsuario = q.idUsuario;

    // Filtros de fecha
    if (q.desde && q.hasta) {
      where.createdAt = Between(
        new Date(q.desde),
        new Date(q.hasta + 'T23:59:59.999Z'),
      );
    } else if (q.desde) {
      where.createdAt = MoreThanOrEqual(new Date(q.desde));
    } else if (q.hasta) {
      where.createdAt = LessThanOrEqual(new Date(q.hasta + 'T23:59:59.999Z'));
    }

    const take = Math.min(q.limite || 10, 100); // Máximo 100 registros
    const skip = ((q.pagina || 1) - 1) * take;

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take,
      skip,
    });

    const totalPaginas = Math.ceil(total / take);

    return {
      total,
      pagina: q.pagina || 1,
      totalPaginas,
      limite: take,
      datos: data.map((item) => ({
        id: item.id,
        accion: item.accion,
        nombreTabla: item.tableName,
        idUsuario: item.idUsuario,
        datosAnteriores: item.oldData,
        datosNuevos: item.newData,
        ip: item.ip,
        agenteUsuario: item.agenteUsuario,
        fechaCreacion: item.createdAt,
      })),
    };
  }
}
