// Importar el servicio de resultados directamente
const { Pool } = require('pg');
const ResultadosService = require('./resultados-service-final');

async function testEndpointSimulation() {
  try {
    console.log('🚀 Simulando endpoint de resultados para orden 84961...');
    
    // Crear pool de conexión
    const pool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '031101',
      database: 'reto_senasoft'
    });
    
    // Crear instancia del servicio
    const resultadosService = new ResultadosService(pool);
    
    console.log('📋 Obteniendo resultados compatibles para orden 84961...');
    
    // Simular lo que hace el endpoint
    const resultados = await resultadosService.resultadosCompatible(84961);
    
    console.log('✅ Resultados del endpoint simulado:');
    console.log(JSON.stringify(resultados, null, 2));
    
    // Verificar si hay datos en los resultados
    if (resultados && resultados.resultados && resultados.resultados.grupos) {
      console.log('\n📊 Análisis de resultados:');
      console.log(`- Total grupos: ${resultados.resultados.total_grupos}`);
      console.log(`- Total procedimientos: ${resultados.resultados.total_procedimientos}`);
      console.log(`- Total pruebas: ${resultados.resultados.total_pruebas}`);
      
      if (resultados.resultados.grupos.length > 0) {
        console.log('\n🔬 Detalles de las pruebas:');
        resultados.resultados.grupos.forEach(grupo => {
          console.log(`  Grupo: ${grupo.nombre}`);
          grupo.procedimientos.forEach(proc => {
            console.log(`    Procedimiento: ${proc.cups_nombre}`);
            proc.pruebas.forEach(prueba => {
              console.log(`      - ${prueba.nombre}: ${prueba.valor}`);
            });
          });
        });
      }
    } else {
      console.log('⚠️  No se encontraron resultados en la respuesta');
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error en la simulación:', error.message);
    console.error('Stack:', error.stack);
  }
}

testEndpointSimulation();