import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Notificacion } from './notificaciones.modelo';
import { ListarNotificacionesQuery } from './notificaciones.dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion) private repo: Repository<Notificacion>,
  ) {}

  async crear(dto: any) {
    // Mapeo de DTO español a entidad inglés
    const entity = this.repo.create({
      idUsuario: dto.idUsuario,
      type: dto.tipo || 'info',
      titulo: dto.titulo,
      mensaje: dto.mensaje,
      data: dto.datos,
      metadata: dto.metadata ?? null,
    });
    return this.repo.save(entity);
  }

  async listar(query: ListarNotificacionesQuery) {
    const { idUsuario, soloNoLeidas, pagina = 1, tipo, desde, hasta } = query;
    const take = 10, skip = (pagina - 1) * take;
    const where: any = { idUsuario };
    
    if (soloNoLeidas) where.leida = false;
    if (tipo) where.type = tipo;
    
    // Filtros de fecha
    if (desde && hasta) {
      where.fechaCreacion = Between(new Date(desde), new Date(hasta + 'T23:59:59.999Z'));
    } else if (desde) {
      where.fechaCreacion = MoreThanOrEqual(new Date(desde));
    } else if (hasta) {
      where.fechaCreacion = LessThanOrEqual(new Date(hasta + 'T23:59:59.999Z'));
    }

    const [rows, total] = await this.repo.findAndCount({
      where, 
      order: { fechaCreacion: 'DESC' }, 
      take, 
      skip,
    });

    // Mapeo de entidad inglés a respuesta español
    const data = rows.map(n => ({
      id: n.id,
      idUsuario: n.idUsuario,
      tipo: n.type,
      titulo: n.titulo,
      mensaje: n.mensaje,
      datos: n.data,
      metadata: n.metadata,
      leida: n.leida,
      fechaCreacion: n.fechaCreacion,
      fechaLectura: n.fechaLectura,
    }));

    return { 
       total, 
       pagina, 
       totalPaginas: Math.ceil(total / take),
       data 
     };
   }

   async conteoNoLeidas(idUsuario: number) {
     const count = await this.repo.count({
       where: { idUsuario, leida: false }
     });
     return { conteo: count };
   }

  async marcarLeida(id: number, leida = true) {
    const notif = await this.repo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notificación no encontrada');
    
    notif.leida = leida;
    notif.fechaLectura = leida ? new Date() : null;
    return this.repo.save(notif);
  }

  async eliminar(id: number) {
    const n = await this.repo.findOne({ where: { id } });
    if (!n) throw new NotFoundException('Notificación no encontrada');
    await this.repo.remove(n);
    return { ok: true };
  }
}
