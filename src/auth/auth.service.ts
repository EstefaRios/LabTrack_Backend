import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Persona } from '../paciente/paciente.modelo';
import { ListaOpcion } from './auth.modelo';
import { LoginPacienteDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Persona) private personaRepo: Repository<Persona>,
    @InjectRepository(ListaOpcion) private listaRepo: Repository<ListaOpcion>,
    private jwt: JwtService,
  ) {}

  async loginPaciente(dto: LoginPacienteDto, ip?: string) {
    const tipo = await this.listaRepo.findOne({ where: { variable: 'TipoIdentificacion', abreviacion: dto.tipo }, select: ['id'] });
    if (!tipo) throw new NotFoundException('Tipo de identificación inválido');

    const persona = await this.personaRepo.findOne({
      where: {
        idTipoId: tipo.id,
        numeroId: dto.numero,
        fechaNac: dto.fechaNacimiento,
      },
    });
    if (!persona) throw new NotFoundException('Paciente no encontrado');

    const payload = { sub: persona.id, tipo: dto.tipo, ip };
    const token = await this.jwt.signAsync(payload, { expiresIn: process.env.JWT_EXPIRES || '2h' });

    return {
      access_token: token,
      personaId: persona.id,
      nombre: [persona.nombre1, persona.nombre2].filter(Boolean).join(' '),
      apellidos: [persona.apellido1, persona.apellido2].filter(Boolean).join(' '),
    };
  }
}
