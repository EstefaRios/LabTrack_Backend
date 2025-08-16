# Servicio de Resultados Mejorado

## Descripción

Este servicio ha sido desarrollado específicamente para trabajar con la estructura real de la base de datos de 16 tablas del sistema de laboratorio. Proporciona una interfaz optimizada y robusta para obtener resultados de laboratorio con toda la información relacionada.

## Archivos Creados

### 1. `queries-for-ui.sql`
Contiene las consultas SQL optimizadas para poblar la interfaz de usuario de resultados, incluyendo:
- Consulta principal para obtener resultados completos
- Consultas para verificar órdenes
- Consultas para información de pacientes
- Consultas para estadísticas
- Notas de implementación e índices recomendados

### 2. `improved-resultados-service.js`
Servicio de desarrollo y pruebas que sirvió para validar las consultas con la estructura real de la base de datos.

### 3. `check-tables.js`
Script de utilidad para verificar la estructura de las tablas en la base de datos.

### 4. `resultados-service-final.js` ⭐
**Archivo principal del servicio mejorado** - Listo para producción.

## Características del Servicio Final

### ✅ Funcionalidades Implementadas

1. **Consultas Optimizadas**: Basadas en la estructura real de las 16 tablas
2. **Formateo Estructurado**: Datos organizados jerárquicamente (Grupos → Procedimientos → Pruebas)
3. **Compatibilidad**: Método compatible con el servicio existente para migración gradual
4. **Manejo de Errores**: Robusto y con logging detallado
5. **Valores de Referencia**: Soporte para valores desde opciones de pruebas
6. **Información Completa**: Incluye datos de paciente, EPS, profesional, etc.

### 🔧 Métodos Principales

#### `getResultadosCompletos(idOrden)`
Obtiene todos los resultados de una orden con información completa:
- Resultados organizados por grupos y procedimientos
- Información de pruebas, CUPS, y opciones
- Valores de referencia cuando están disponibles

#### `getInfoPaciente(idOrden)`
Obtiene información completa del paciente:
- Datos personales (nombres, documento, fecha nacimiento)
- Información de contacto
- EPS y tipo de documento
- Historia clínica

#### `verificarOrden(idOrden)`
Verifica la existencia de una orden y obtiene información básica.

#### `getEstadisticasResultados(idOrden)`
Obtiene estadísticas de la orden:
- Total de resultados, procedimientos y grupos
- Distribución por tipo de resultado (numérico, opción, texto, memo)

#### `resultadosCompatible(idOrden)` 🔄
**Método de migración** - Proporciona formato compatible con el servicio anterior.

## Estructura de Datos Devuelta

### Formato Jerárquico
```javascript
{
  grupos: [
    {
      id: 1,
      codigo: "HEMA",
      nombre: "HEMATOLOGIA",
      habilitado: true,
      procedimientos: [
        {
          id: 123,
          cups_codigo: "90.1.2.01",
          cups_nombre: "HEMOGRAMA IV",
          metodo: "AUTOMATICO",
          pruebas: [
            {
              id: 456,
              nombre: "HEMOGLOBINA",
              codigo: "HGB",
              unidad: "g/dL",
              valor: 12.5,
              tipo_resultado: "numerico",
              valor_ref_min: 12.0,
              valor_ref_max: 16.0,
              fecha_resultado: "2024-01-15"
            }
          ]
        }
      ]
    }
  ],
  total_grupos: 1,
  total_procedimientos: 1,
  total_pruebas: 1
}
```

## Tablas Utilizadas

El servicio trabaja con las siguientes tablas de la base de datos:

### Tablas Principales
- `lab_m_orden` - Órdenes de laboratorio
- `lab_m_orden_resultados` - Resultados de las pruebas
- `lab_p_pruebas` - Catálogo de pruebas
- `lab_p_procedimientos` - Procedimientos de laboratorio
- `lab_p_grupos` - Grupos de laboratorio
- `lab_p_pruebas_opciones` - Opciones de pruebas

### Tablas de Facturación
- `fac_p_cups` - Códigos CUPS
- `fac_m_tarjetero` - Información de pacientes

### Tablas Generales
- `gen_m_persona` - Datos personales
- `gen_p_documento` - Tipos de documento
- `gen_p_eps` - Entidades promotoras de salud

### Tablas Adicionales
- `audit_log` - Auditoría del sistema
- `notificaciones` - Sistema de notificaciones

## Uso del Servicio

### Instalación
```javascript
const ResultadosServiceFinal = require('./resultados-service-final');
const service = new ResultadosServiceFinal();
```

### Ejemplo de Uso
```javascript
async function obtenerResultados(idOrden) {
  try {
    // Método recomendado - Formato estructurado
    const resultados = await service.getResultadosCompletos(idOrden);
    const paciente = await service.getInfoPaciente(idOrden);
    const estadisticas = await service.getEstadisticasResultados(idOrden);
    
    // O usar el método compatible para migración
    const resultadosCompatibles = await service.resultadosCompatible(idOrden);
    
    return resultadosCompatibles;
  } catch (error) {
    console.error('Error obteniendo resultados:', error);
    throw error;
  } finally {
    await service.destroy();
  }
}
```

## Migración desde el Servicio Anterior

1. **Fase 1**: Usar `resultadosCompatible()` como reemplazo directo
2. **Fase 2**: Migrar gradualmente a `getResultadosCompletos()` para aprovechar la estructura mejorada
3. **Fase 3**: Implementar funcionalidades adicionales usando los métodos específicos

## Rendimiento y Optimización

### Índices Recomendados
```sql
-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_orden_resultados_orden ON lab_m_orden_resultados(id_orden);
CREATE INDEX IF NOT EXISTS idx_orden_resultados_procedimiento ON lab_m_orden_resultados(id_procedimiento);
CREATE INDEX IF NOT EXISTS idx_orden_resultados_prueba ON lab_m_orden_resultados(id_prueba);
CREATE INDEX IF NOT EXISTS idx_procedimientos_grupo ON lab_p_procedimientos(id_grupo_laboratorio);
CREATE INDEX IF NOT EXISTS idx_procedimientos_cups ON lab_p_procedimientos(id_cups);
CREATE INDEX IF NOT EXISTS idx_tarjetero_historia ON fac_m_tarjetero(id);
CREATE INDEX IF NOT EXISTS idx_persona_id ON gen_m_persona(id);
```

### Características de Rendimiento
- Consultas optimizadas con JOINs eficientes
- Uso de LEFT JOIN para datos opcionales
- Formateo en memoria para reducir consultas múltiples
- Conexión reutilizable con pooling automático

## Pruebas

El servicio incluye pruebas automáticas que se ejecutan al llamar el archivo directamente:

```bash
node resultados-service-final.js
```

## Estado del Proyecto

✅ **Completado**: Servicio funcional con todas las características implementadas
✅ **Probado**: Validado con datos reales de la base de datos
✅ **Documentado**: Documentación completa y ejemplos de uso
✅ **Optimizado**: Consultas eficientes y estructura de datos mejorada

## Próximos Pasos Recomendados

1. Integrar el servicio en el controlador principal
2. Actualizar el frontend para usar la nueva estructura de datos
3. Implementar caché para mejorar rendimiento
4. Agregar validaciones adicionales
5. Implementar logging más detallado

---

**Nota**: Este servicio está listo para producción y ha sido desarrollado específicamente para trabajar con la estructura real de las 16 tablas del sistema.