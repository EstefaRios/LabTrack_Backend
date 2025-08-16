import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificacionesService } from './notificaciones.service';
import { CrearNotificacionDto, ListarNotificacionesQuery, MarcarLeidaDto } from './notificaciones.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResourceOwnerGuard, ResourceOwner } from '../common/guards/resource-owner.guard';
import { NotificationOwnerGuard } from '../common/guards/notification-owner.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { Audit } from '../common/decorators/audit.decorator';
import { PacienteOnly } from '../common/decorators/roles.decorator';

@ApiTags('Notificaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@PacienteOnly()
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private service: NotificacionesService) {}

  @Get()
  @UseGuards(ResourceOwnerGuard)
  @ResourceOwner('idUsuario')
  @Audit('LISTAR_NOTIFICACIONES')
  @ApiOperation({ summary: 'Listar notificaciones de un usuario con filtros y paginación' })
  listar(@Query() q: ListarNotificacionesQuery) {
    return this.service.listar(q);
  }

  @Get('conteo-no-leidas/:idUsuario')
  @UseGuards(ResourceOwnerGuard)
  @ResourceOwner('idUsuario')
  @Audit('CONTEO_NO_LEIDAS')
  @ApiOperation({ summary: 'Obtener conteo de notificaciones no leídas' })
  conteoNoLeidas(@Param('idUsuario') idUsuario: string) {
    return this.service.conteoNoLeidas(+idUsuario);
  }

  @Post()
  @Audit('CREAR_NOTIFICACION')
  @ApiOperation({ summary: 'Crear notificación' })
  crear(@Body() dto: CrearNotificacionDto, @CurrentUserId() currentUserId: number) {
    // Asegurar que el usuario solo puede crear notificaciones para sí mismo
    dto.idUsuario = currentUserId;
    return this.service.crear(dto);
  }

  @Post(':id/leida')
  @UseGuards(NotificationOwnerGuard)
  @Audit('MARCAR_LEIDA')
  @ApiOperation({ summary: 'Marcar notificación como leída/no leída' })
  marcar(@Param('id') id: string, @Body() dto: MarcarLeidaDto) {
    return this.service.marcarLeida(+id, dto.leida);
  }

  @Delete(':id')
  @UseGuards(NotificationOwnerGuard)
  @Audit('ELIMINAR_NOTIFICACION')
  @ApiOperation({ summary: 'Eliminar notificación' })
  eliminar(@Param('id') id: string) {
    return this.service.eliminar(+id);
  }
}
