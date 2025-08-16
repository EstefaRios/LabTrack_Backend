import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './paciente.modelo';

@Injectable()
export class PacienteService {
  constructor(@InjectRepository(Persona) private repo: Repository<Persona>) {}
  
  async getPerfil(personaId: number) {
    const result = await this.repo.createQueryBuilder('p')
      .leftJoin('gen_p_listaopcion', 'tipo', "p.id_tipoid = tipo.id AND tipo.variable = 'TipoIdentificacion'")
      .leftJoin('gen_p_listaopcion', 'sexo', "p.id_sexobiologico = sexo.id AND sexo.variable = 'SexoBiologico'")
      .leftJoin('fac_m_tarjetero', 't', 'p.id = t.id_persona')
      .leftJoin('gen_p_eps', 'eps', 't.id_eps = eps.id')
      .select([
        'p.id as p_id',
        'p.id_tipoid as p_id_tipoid',
        'p.numeroid as p_numeroid',
        'p.nombre1 as p_nombre1',
        'p.nombre2 as p_nombre2',
        'p.apellido1 as p_apellido1',
        'p.apellido2 as p_apellido2',
        'p.fechanac as p_fechanac',
        'p.id_sexobiologico as p_id_sexobiologico',
        'p.direccion as p_direccion',
        'p.tel_movil as p_tel_movil',
        'p.email as p_email',
        'tipo.descripcion as tipoIdDescripcion',
        'sexo.nombre as sexoDescripcion',
        'eps.codigo as eps_codigo',
        'eps.razonsocial as eps_nombre'
      ])
      .where('p.id = :personaId', { personaId: +personaId })
      .getRawOne();

    if (!result) throw new NotFoundException('Paciente no encontrado');
    
    // Debug: Log para ver los datos exactos que devuelve la consulta
    console.log('=== DEBUG PERFIL ===');
    console.log('result.tipoIdDescripcion:', result.tipoIdDescripcion);
    console.log('result.sexoDescripcion:', result.sexoDescripcion);
    console.log('result.p_id_tipoid:', result.p_id_tipoid);
    console.log('result.p_id_sexobiologico:', result.p_id_sexobiologico);
    console.log('Full result:', result);
    console.log('===================');
    
    // Mapear los campos de la base de datos a los nombres esperados por el frontend
    return {
      id: result.p_id,
      tipo: result.tipoiddescripcion || 'No especificado',
      tipoId: result.tipoiddescripcion || 'No especificado',
      numeroId: result.p_numeroid,
      nombreCompleto: [result.p_nombre1, result.p_nombre2, result.p_apellido1, result.p_apellido2]
        .filter(Boolean)
        .join(' '),
      nombre1: result.p_nombre1,
      nombre2: result.p_nombre2,
      apellido1: result.p_apellido1,
      apellido2: result.p_apellido2,
      fechaNacimiento: result.p_fechanac,
      fechaNac: result.p_fechanac,
      sexo: result.sexodescripcion || 'No especificado',
      idSexoBiologico: result.p_id_sexobiologico,
      direccion: result.p_direccion,
      telefono: result.p_tel_movil,
      telMovil: result.p_tel_movil,
      email: result.p_email,
      eps_codigo: result.eps_codigo,
      eps_nombre: result.eps_nombre,
      eps: result.eps_nombre || 'No especificado'
    };
  }

  async listarPacientes(pagina: number = 1, limite: number = 50, busqueda?: string) {
    const qb = this.repo.createQueryBuilder('p')
      .leftJoin('gen_p_listaopcion', 'l', 'p.id_tipoid = l.id AND l.variable = \'TipoIdentificacion\'')
      .select([
        'p.id',
        'p.numeroId',
        'p.nombre1',
        'p.nombre2', 
        'p.apellido1',
        'p.apellido2',
        'p.fechaNac',
        'l.abreviacion as tipoDocumento',
        'l.descripcion as tipoDocumentoDesc'
      ]);

    if (busqueda) {
      qb.where(
        '(p.nombre1 ILIKE :busqueda OR p.nombre2 ILIKE :busqueda OR p.apellido1 ILIKE :busqueda OR p.apellido2 ILIKE :busqueda OR p.numeroId ILIKE :busqueda)',
        { busqueda: `%${busqueda}%` }
      );
    }

    qb.orderBy('p.apellido1', 'ASC')
      .addOrderBy('p.apellido2', 'ASC')
      .addOrderBy('p.nombre1', 'ASC');

    const skip = (pagina - 1) * limite;
    const [pacientes, total] = await qb.skip(skip).take(limite).getManyAndCount();

    return {
      data: pacientes.map(p => ({
        id: p.id,
        numeroId: p.numeroId,
        nombreCompleto: [p.nombre1, p.nombre2, p.apellido1, p.apellido2].filter(Boolean).join(' '),
        nombre1: p.nombre1,
        nombre2: p.nombre2,
        apellido1: p.apellido1,
        apellido2: p.apellido2,
        fechaNac: p.fechaNac,
        tipoDocumento: p['tipoDocumento'],
        tipoDocumentoDesc: p['tipoDocumentoDesc']
      })),
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite)
    };
  }
}
