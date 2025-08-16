const ResultadosServiceFinal = require('./resultados-service-final');

async function testOrden84961() {
  const service = new ResultadosServiceFinal();
  
  try {
    console.log('🧪 Probando orden 84961 específicamente...');
    
    // 1. Verificar que la orden existe
    const ordenInfo = await service.verificarOrden(84961);
    console.log('📋 Información de la orden:', ordenInfo);
    
    if (!ordenInfo) {
      console.log('❌ La orden 84961 no existe');
      return;
    }
    
    // 2. Obtener información del paciente
    const pacienteInfo = await service.getInfoPaciente(84961);
    console.log('👤 Información del paciente:', pacienteInfo);
    
    // 3. Obtener estadísticas
    const estadisticas = await service.getEstadisticasResultados(84961);
    console.log('📊 Estadísticas:', estadisticas);
    
    // 4. Obtener resultados completos
    const resultadosCompletos = await service.getResultadosCompletos(84961);
    console.log('🧪 Resultados completos:', JSON.stringify(resultadosCompletos, null, 2));
    
    // 5. Probar el método compatible
    const resultadosCompatibles = await service.resultadosCompatible(84961);
    console.log('🔄 Resultados compatibles:', JSON.stringify(resultadosCompatibles, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await service.destroy();
  }
}

testOrden84961();