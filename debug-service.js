require('dotenv').config();
const { DataSource } = require('typeorm');

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [],
  synchronize: false,
});

async function debugService() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await dataSource.initialize();
    
    const idOrden = 84577;
    console.log(`🔍 Debuggeando servicio para orden ${idOrden}`);
    
    // Paso 1: Verificar que la orden existe
    console.log('1. Verificando orden...');
    const orden = await dataSource.query('SELECT * FROM lab_m_orden WHERE id = $1', [idOrden]);
    console.log('   Orden encontrada:', orden.length > 0 ? 'SÍ' : 'NO');
    if (orden.length > 0) console.log('   Detalles:', orden[0]);
    
    // Paso 2: Buscar resultados
    console.log('\n2. Buscando resultados...');
    const resultados = await dataSource.query(`
      SELECT * FROM lab_m_orden_resultados 
      WHERE id_orden = $1 
      ORDER BY id_procedimiento ASC, id_prueba ASC, fecha ASC
    `, [idOrden]);
    console.log('   Resultados encontrados:', resultados.length);
    if (resultados.length > 0) {
      console.log('   Primer resultado:', resultados[0]);
    }
    
    // Paso 3: Verificar procedimientos
    if (resultados.length > 0) {
      const procIds = [...new Set(resultados.map(r => r.id_procedimiento))];
      console.log('\n3. IDs de procedimientos únicos:', procIds);
      
      const procedimientos = await dataSource.query(`
        SELECT * FROM lab_p_procedimientos WHERE id = ANY($1)
      `, [procIds]);
      console.log('   Procedimientos encontrados:', procedimientos.length);
      if (procedimientos.length > 0) {
        console.log('   Primer procedimiento:', procedimientos[0]);
      }
    }
    
    // Paso 4: Verificar pruebas
    if (resultados.length > 0) {
      const pruebaIds = [...new Set(resultados.map(r => r.id_prueba))];
      console.log('\n4. IDs de pruebas únicos:', pruebaIds.slice(0, 5));
      
      const pruebas = await dataSource.query(`
        SELECT * FROM lab_p_pruebas WHERE id = ANY($1) LIMIT 3
      `, [pruebaIds]);
      console.log('   Pruebas encontradas:', pruebas.length);
      if (pruebas.length > 0) {
        console.log('   Primera prueba:', pruebas[0]);
      }
    }
    
    // Paso 5: Verificar grupos
    if (resultados.length > 0) {
      const procIds = [...new Set(resultados.map(r => r.id_procedimiento))];
      const procedimientos = await dataSource.query(`
        SELECT * FROM lab_p_procedimientos WHERE id = ANY($1)
      `, [procIds]);
      
      if (procedimientos.length > 0) {
        const grupoIds = [...new Set(procedimientos.map(p => p.id_grupo_laboratorio))];
        console.log('\n5. IDs de grupos únicos:', grupoIds);
        
        const grupos = await dataSource.query(`
          SELECT * FROM lab_p_grupos WHERE id = ANY($1)
        `, [grupoIds]);
        console.log('   Grupos encontrados:', grupos.length);
        if (grupos.length > 0) {
          console.log('   Primer grupo:', grupos[0]);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Conexión cerrada.');
  }
}

debugService();