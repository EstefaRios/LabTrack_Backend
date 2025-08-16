require('dotenv').config();
const { DataSource } = require('typeorm');

// Configuración de la base de datos
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false
});

class ImprovedResultadosService {
  constructor() {
    this.dataSource = dataSource;
  }

  /**
   * Obtiene los resultados completos de una orden con toda la información necesaria
   * Basado en las tablas reales disponibles en la base de datos
   */
  async getResultadosCompletos(ordenId) {
    try {
      const query = `
        SELECT 
          r.id as resultado_id,
          r.fecha as fecha_resultado,
          r.id_orden,
          r.id_procedimiento,
          r.id_prueba,
          r.id_pruebaopcion,
          r.res_opcion,
          r.res_numerico,
          r.res_texto,
          r.res_memo,
          r.num_procesamientos,
          
          -- Información de la prueba
           pr.codigo_prueba,
           pr.nombre_prueba,
           pr.id_tipo_resultado,
           pr.unidad,
           pr.habilita as prueba_habilitada,
          
          -- Información del procedimiento
          proc.id_cups,
          proc.id_grupo_laboratorio,
          proc.metodo,
          
          -- Información del grupo
           g.codigo as grupo_codigo,
           g.nombre as grupo_nombre,
           g.habilita as grupo_habilitado,
          
          -- Información de CUPS
           cups.codigo as cups_codigo,
           cups.nombre as cups_nombre,
           cups.habilita as cups_habilitado,
          
          -- Opciones de prueba (si aplica)
          po.opcion,
          po.valor_ref_min_m as opcion_min_m,
          po.valor_ref_max_m as opcion_max_m,
          po.valor_ref_min_f as opcion_min_f,
          po.valor_ref_max_f as opcion_max_f
          
        FROM lab_m_orden_resultados r
        INNER JOIN lab_p_pruebas pr ON r.id_prueba = pr.id
        INNER JOIN lab_p_procedimientos proc ON r.id_procedimiento = proc.id
        INNER JOIN lab_p_grupos g ON proc.id_grupo_laboratorio = g.id
        INNER JOIN fac_p_cups cups ON proc.id_cups = cups.id
        LEFT JOIN lab_p_pruebas_opciones po ON r.id_pruebaopcion = po.id
        WHERE r.id_orden = $1
        ORDER BY g.nombre, cups.nombre, pr.nombre_prueba
      `;
      
      const resultados = await this.dataSource.query(query, [ordenId]);
      return this.formatearResultados(resultados);
      
    } catch (error) {
      console.error('Error obteniendo resultados completos:', error);
      throw error;
    }
  }

  /**
   * Obtiene información del paciente basada en las tablas disponibles
   */
  async getInfoPaciente(ordenId) {
    try {
      const query = `
        SELECT 
           o.id as orden_id,
           o.id_documento,
           o.fecha,
           o.orden,
           o.id_historia,
           o.id_profesional_ordena,
           o.profesional_externo,
          
          -- Información del tarjetero (paciente)
          t.id as tarjetero_id,
          t.historia,
          t.id_persona,
          t.id_regimen,
          t.id_eps,
          
          -- Información de la persona
           p.id_tipoid as persona_tipo_documento,
           p.numeroid,
           p.apellido1,
           p.apellido2,
           p.nombre1,
           p.nombre2,
           p.fechanac,
           p.id_sexobiologico,
           p.direccion,
           p.tel_movil,
           p.email,
           
           -- Información del documento
           doc.codigo as tipo_documento_codigo,
           doc.nombre as tipo_documento_nombre,
          
          -- Información de EPS
           eps.codigo as eps_codigo,
           eps.razonsocial as eps_nombre,
          
          -- Información del profesional
          prof.codigo as profesional_codigo,
          prof.registro_medico,
          prof.id_tipo_prof
          
        FROM lab_m_orden o
         INNER JOIN fac_m_tarjetero t ON o.id_historia = t.id
        INNER JOIN gen_m_persona p ON t.id_persona = p.id
        LEFT JOIN gen_p_documento doc ON p.id_tipoid = doc.id
        LEFT JOIN gen_p_eps eps ON t.id_eps = eps.id
        LEFT JOIN fac_p_profesional prof ON o.id_profesional_ordena = prof.id
        WHERE o.id = $1
      `;
      
      const resultado = await this.dataSource.query(query, [ordenId]);
      return resultado[0] || null;
      
    } catch (error) {
      console.error('Error obteniendo información del paciente:', error);
      throw error;
    }
  }

  /**
    * Verifica si una orden existe
    */
   async verificarOrden(ordenId) {
     try {
       const query = `
         SELECT id, fecha, orden
         FROM lab_m_orden 
         WHERE id = $1
       `;
       
       const resultado = await this.dataSource.query(query, [ordenId]);
       return resultado.length > 0;
       
     } catch (error) {
       console.error('Error verificando orden:', error);
       throw error;
     }
   }

  /**
   * Obtiene estadísticas de resultados
   */
  async getEstadisticasResultados(ordenId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_resultados,
          COUNT(CASE WHEN res_numerico IS NOT NULL THEN 1 END) as resultados_numericos,
          COUNT(CASE WHEN res_texto IS NOT NULL THEN 1 END) as resultados_texto,
          COUNT(CASE WHEN res_opcion IS NOT NULL THEN 1 END) as resultados_opcion,
          COUNT(CASE WHEN res_memo IS NOT NULL THEN 1 END) as resultados_memo,
          COUNT(DISTINCT id_procedimiento) as total_procedimientos,
          COUNT(DISTINCT proc.id_grupo_laboratorio) as total_grupos
        FROM lab_m_orden_resultados r
        INNER JOIN lab_p_procedimientos proc ON r.id_procedimiento = proc.id
        WHERE r.id_orden = $1
      `;
      
      const resultado = await this.dataSource.query(query, [ordenId]);
      return resultado[0];
      
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Formatea los resultados en la estructura esperada por el frontend
   */
  formatearResultados(resultados) {
    const grupos = new Map();
    
    resultados.forEach(resultado => {
      const grupoKey = `${resultado.id_grupo_laboratorio}_${resultado.grupo_nombre}`;
      
      if (!grupos.has(grupoKey)) {
        grupos.set(grupoKey, {
          id: resultado.id_grupo_laboratorio,
          nombre: resultado.grupo_nombre,
          codigo: resultado.grupo_codigo,
          habilitado: resultado.grupo_habilitado,
          procedimientos: new Map()
        });
      }
      
      const grupo = grupos.get(grupoKey);
      const procKey = `${resultado.id_procedimiento}_${resultado.cups_nombre}`;
      
      if (!grupo.procedimientos.has(procKey)) {
        grupo.procedimientos.set(procKey, {
          id: resultado.id_procedimiento,
          nombre: resultado.cups_nombre,
          codigo: resultado.cups_codigo,
          metodo: resultado.metodo,
          pruebas: []
        });
      }
      
      const procedimiento = grupo.procedimientos.get(procKey);
      
      // Determinar el valor del resultado
      let valor = null;
      let tipo_resultado = null;
      
      if (resultado.res_numerico !== null) {
        valor = parseFloat(resultado.res_numerico);
        tipo_resultado = 'numerico';
      } else if (resultado.res_opcion !== null) {
        valor = resultado.res_opcion;
        tipo_resultado = 'opcion';
      } else if (resultado.res_texto !== null) {
        valor = resultado.res_texto;
        tipo_resultado = 'texto';
      } else if (resultado.res_memo !== null) {
        valor = resultado.res_memo;
        tipo_resultado = 'memo';
      }
      
      // Determinar valores de referencia desde opciones
       let valor_ref_min = null;
       let valor_ref_max = null;
       
       if (resultado.id_pruebaopcion && resultado.opcion_min_m !== null) {
         // Usar valores de referencia de la opción
         valor_ref_min = resultado.opcion_min_m;
         valor_ref_max = resultado.opcion_max_m;
       }
      
      procedimiento.pruebas.push({
        id: resultado.id_prueba,
         nombre: resultado.nombre_prueba,
         codigo: resultado.codigo_prueba,
         id_tipo_resultado: resultado.id_tipo_resultado,
         unidad: resultado.unidad,
         valor: valor,
         tipo_resultado: tipo_resultado,
         valor_ref_min: valor_ref_min,
         valor_ref_max: valor_ref_max,
         fecha_resultado: resultado.fecha_resultado,
         opcion_seleccionada: resultado.opcion,
         num_procesamientos: resultado.num_procesamientos,
         habilitada: resultado.prueba_habilitada
      });
    });
    
    // Convertir Maps a arrays
    const gruposArray = Array.from(grupos.values()).map(grupo => ({
      ...grupo,
      procedimientos: Array.from(grupo.procedimientos.values())
    }));
    
    return gruposArray;
  }

  /**
   * Método principal compatible con el servicio actual
   */
  async resultadosCompatible(ordenId) {
    try {
      // Verificar que la orden existe
      const ordenExiste = await this.verificarOrden(ordenId);
      if (!ordenExiste) {
        throw new Error(`Orden ${ordenId} no encontrada`);
      }
      
      // Obtener resultados y información del paciente
      const [grupos, pacienteInfo, estadisticas] = await Promise.all([
        this.getResultadosCompletos(ordenId),
        this.getInfoPaciente(ordenId),
        this.getEstadisticasResultados(ordenId)
      ]);
      
      return {
        grupos,
        paciente: pacienteInfo,
        estadisticas,
        orden_id: ordenId
      };
      
    } catch (error) {
      console.error('Error en resultadosCompatible:', error);
      throw error;
    }
  }
}

// Función de prueba
async function testImprovedService() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await dataSource.initialize();
    
    const service = new ImprovedResultadosService();
    const ordenId = 84577; // ID de prueba
    
    console.log(`\n🧪 Probando servicio mejorado con orden ${ordenId}...`);
    
    // Verificar orden
    console.log('\n1. Verificando orden...');
    const ordenExiste = await service.verificarOrden(ordenId);
    console.log(`   Orden existe: ${ordenExiste}`);
    
    if (ordenExiste) {
      // Obtener información del paciente
      console.log('\n2. Obteniendo información del paciente...');
      const pacienteInfo = await service.getInfoPaciente(ordenId);
      if (pacienteInfo) {
        console.log(`   Paciente: ${pacienteInfo.nombre1} ${pacienteInfo.apellido1}`);
        console.log(`   Documento: ${pacienteInfo.numero_id}`);
        console.log(`   Historia: ${pacienteInfo.historia}`);
      }
      
      // Obtener estadísticas
      console.log('\n3. Obteniendo estadísticas...');
      const stats = await service.getEstadisticasResultados(ordenId);
      console.log(`   Total resultados: ${stats.total_resultados}`);
      console.log(`   Procedimientos: ${stats.total_procedimientos}`);
      console.log(`   Grupos: ${stats.total_grupos}`);
      
      // Obtener resultados completos
      console.log('\n4. Obteniendo resultados completos...');
      const resultados = await service.getResultadosCompletos(ordenId);
      console.log(`   Grupos encontrados: ${resultados.length}`);
      
      resultados.forEach((grupo, index) => {
        console.log(`   Grupo ${index + 1}: ${grupo.nombre} (${grupo.procedimientos.length} procedimientos)`);
        grupo.procedimientos.forEach((proc, procIndex) => {
          console.log(`     Procedimiento ${procIndex + 1}: ${proc.nombre} (${proc.pruebas.length} pruebas)`);
        });
      });
      
      // Probar método compatible
      console.log('\n5. Probando método compatible...');
      const resultadoCompatible = await service.resultadosCompatible(ordenId);
      console.log(`   Resultado compatible generado exitosamente`);
      console.log(`   Grupos: ${resultadoCompatible.grupos.length}`);
      console.log(`   Paciente: ${resultadoCompatible.paciente?.nombre1} ${resultadoCompatible.paciente?.apellido1}`);
    }
    
    console.log('\n✅ Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.query) {
      console.error('Query que falló:', error.query);
    }
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Conexión cerrada.');
    }
  }
}

// Exportar para uso en otros módulos
module.exports = {
  ImprovedResultadosService,
  dataSource
};

// Ejecutar prueba si se ejecuta directamente
if (require.main === module) {
  testImprovedService();
}