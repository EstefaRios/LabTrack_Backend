-- Consultas SQL para alimentar la UI de resultados basadas en el diagrama de BD
-- Estas consultas están diseñadas para obtener todos los datos necesarios para la página de resultados

-- 1. CONSULTA PRINCIPAL: Obtener resultados completos con toda la información necesaria
-- Esta consulta une todas las tablas relevantes para obtener los datos que necesita el frontend
SELECT 
    r.id,
    r.fecha,
    r.id_orden,
    r.id_procedimiento,
    r.id_prueba,
    r.id_pruebaopcion,
    r.res_opcion,
    r.res_numerico,
    r.res_texto,
    r.res_memo,
    r.num_procesamientos,
    
    -- Información del grupo
    g.id as grupo_id,
    g.codigo as grupo_codigo,
    g.nombre as grupo_nombre,
    
    -- Información del procedimiento
    proc.id as procedimiento_id,
    proc.metodo as procedimiento_metodo,
    cups.codigo as cups_codigo,
    cups.nombre as cups_nombre,
    
    -- Información de la prueba
    p.id as prueba_id,
    p.codigo_prueba,
    p.nombre_prueba,
    p.unidad,
    p.id_tipo_resultado,
    
    -- Información de opciones de prueba (si aplica)
    po.opcion as prueba_opcion,
    po.valor_ref_min_f,
    po.valor_ref_max_f,
    po.valor_ref_min_m,
    po.valor_ref_max_m
    
FROM lab_m_orden_resultados r
    INNER JOIN lab_p_pruebas p ON r.id_prueba = p.id
    INNER JOIN lab_p_procedimientos proc ON r.id_procedimiento = proc.id
    INNER JOIN lab_p_grupos g ON proc.id_grupo_laboratorio = g.id
    INNER JOIN fac_p_cups cups ON proc.id_cups = cups.id
    LEFT JOIN lab_p_pruebas_opciones po ON r.id_pruebaopcion = po.id
WHERE r.id_orden = $1  -- Parámetro: ID de la orden
ORDER BY 
    g.codigo ASC,
    proc.id ASC,
    p.codigo_prueba ASC,
    r.fecha ASC;

-- 2. CONSULTA PARA VERIFICAR EXISTENCIA DE ORDEN
SELECT 
    o.id,
    o.orden,
    o.fecha,
    o.id_historia,
    o.id_profesional_ordena,
    o.profesional_externo,
    
    -- Información del documento asociado
    d.codigo as documento_codigo,
    d.nombre as documento_nombre
    
FROM lab_m_orden o
    LEFT JOIN gen_p_documento d ON o.id_documento = d.id
WHERE o.id = $1;  -- Parámetro: ID de la orden

-- 3. CONSULTA PARA OBTENER INFORMACIÓN DEL PACIENTE DESDE TARJETERO
-- Esta consulta obtiene la información del paciente asociado a una orden
SELECT 
    p.id as persona_id,
    p.numeroid,
    p.apellido1,
    p.apellido2,
    p.nombre1,
    p.nombre2,
    p.fechanac,
    p.direccion,
    p.tel_movil,
    p.email,
    
    -- Información del tipo de documento
    td.codigo as tipo_documento_codigo,
    td.nombre as tipo_documento_nombre,
    
    -- Información del sexo biológico
    sb.variable as sexo,
    
    -- Información del tarjetero (EPS, régimen, etc.)
    t.historia,
    eps.codigo as eps_codigo,
    eps.razonsocial as eps_nombre,
    nivel.nombre as nivel_nombre,
    regimen.nombre as regimen_nombre
    
FROM lab_m_orden o
    INNER JOIN fac_m_tarjetero t ON o.id_historia = t.id
    INNER JOIN gen_m_persona p ON t.id_persona = p.id
    LEFT JOIN gen_p_documento td ON p.id_tipoid = td.id
    LEFT JOIN gen_p_listaopcion sb ON p.id_sexobiologico = sb.id
    LEFT JOIN gen_p_eps eps ON t.id_eps = eps.id
    LEFT JOIN fac_p_nivel nivel ON t.id_nivel = nivel.id
    LEFT JOIN fac_p_regimen regimen ON t.id_regimen = regimen.id
WHERE o.id = $1;  -- Parámetro: ID de la orden

-- 4. CONSULTA PARA OBTENER INFORMACIÓN DEL PROFESIONAL QUE ORDENÓ
SELECT 
    prof.id,
    prof.codigo,
    prof.id_persona,
    prof.registro_medico,
    prof.id_tipo_prof,
    
    -- Información personal del profesional
    p.numeroid,
    p.apellido1,
    p.apellido2,
    p.nombre1,
    p.nombre2,
    
    -- Tipo de documento del profesional
    td.codigo as tipo_documento_codigo,
    td.nombre as tipo_documento_nombre
    
FROM lab_m_orden o
    INNER JOIN fac_p_profesional prof ON o.id_profesional_ordena = prof.id
    INNER JOIN gen_m_persona p ON prof.id_persona = p.id
    LEFT JOIN gen_p_documento td ON p.id_tipoid = td.id
WHERE o.id = $1  -- Parámetro: ID de la orden
    AND o.profesional_externo = false;

-- 5. CONSULTA OPTIMIZADA PARA EL SERVICIO ACTUAL (COMPATIBLE CON EL CÓDIGO EXISTENTE)
-- Esta consulta replica la lógica actual del servicio pero con mejor rendimiento
SELECT 
    r.id,
    r.fecha,
    r.id_orden as "idOrden",
    r.id_procedimiento as "idProcedimiento",
    r.id_prueba as "idPrueba",
    r.id_pruebaopcion as "idPruebaOpcion",
    r.res_opcion as "resOpcion",
    r.res_numerico as "resNumerico",
    r.res_texto as "resTexto",
    r.res_memo as "resMemo",
    r.num_procesamientos as "numProcesamientos",
    
    -- Información del grupo (para agrupar en el frontend)
    g.id as "grupoId",
    g.codigo as "grupoCodigo",
    g.nombre as "grupoNombre",
    
    -- Información del procedimiento
    proc.id as "procedimientoId",
    proc.metodo as "procedimientoMetodo",
    
    -- Información de la prueba
    p.codigo_prueba as "codigoPrueba",
    p.nombre_prueba as "nombrePrueba",
    p.unidad,
    p.id_tipo_resultado as "idTipoResultado"
    
FROM lab_m_orden_resultados r
    INNER JOIN lab_p_pruebas p ON r.id_prueba = p.id
    INNER JOIN lab_p_procedimientos proc ON r.id_procedimiento = proc.id
    INNER JOIN lab_p_grupos g ON proc.id_grupo_laboratorio = g.id
WHERE r.id_orden = $1
ORDER BY 
    proc.id ASC,
    p.id ASC,
    r.fecha ASC;

-- 6. CONSULTA PARA OBTENER VALORES DE REFERENCIA POR SEXO
-- Esta consulta obtiene los valores de referencia específicos por sexo para una prueba
SELECT 
    po.id,
    po.opcion,
    po.valor_ref_min_f as "valorRefMinF",
    po.valor_ref_max_f as "valorRefMaxF",
    po.valor_ref_min_m as "valorRefMinM",
    po.valor_ref_max_m as "valorRefMaxM"
FROM lab_p_pruebas_opciones po
WHERE po.id_prueba = $1;  -- Parámetro: ID de la prueba

-- 7. CONSULTA PARA ESTADÍSTICAS DE RESULTADOS POR ORDEN
-- Útil para mostrar resúmenes en la UI
SELECT 
    COUNT(*) as total_resultados,
    COUNT(DISTINCT r.id_procedimiento) as total_procedimientos,
    COUNT(DISTINCT g.id) as total_grupos,
    MIN(r.fecha) as fecha_primer_resultado,
    MAX(r.fecha) as fecha_ultimo_resultado
FROM lab_m_orden_resultados r
    INNER JOIN lab_p_procedimientos proc ON r.id_procedimiento = proc.id
    INNER JOIN lab_p_grupos g ON proc.id_grupo_laboratorio = g.id
WHERE r.id_orden = $1;  -- Parámetro: ID de la orden

-- NOTAS DE IMPLEMENTACIÓN:
-- 1. Todas las consultas usan parámetros ($1, $2, etc.) para prevenir inyección SQL
-- 2. Las consultas están optimizadas para el esquema mostrado en el diagrama
-- 3. Se incluyen LEFT JOINs donde los datos pueden ser opcionales
-- 4. Los alias están diseñados para coincidir con la estructura esperada por el frontend
-- 5. El ORDER BY asegura que los resultados se muestren en un orden lógico

-- ÍNDICES RECOMENDADOS PARA MEJOR RENDIMIENTO:
-- CREATE INDEX IF NOT EXISTS idx_orden_resultados_orden ON lab_m_orden_resultados(id_orden);
-- CREATE INDEX IF NOT EXISTS idx_procedimientos_grupo ON lab_p_procedimientos(id_grupo_laboratorio);
-- CREATE INDEX IF NOT EXISTS idx_pruebas_procedimiento ON lab_p_pruebas(id_procedimiento);
-- CREATE INDEX IF NOT EXISTS idx_tarjetero_persona ON fac_m_tarjetero(id_persona);
-- CREATE INDEX IF NOT EXISTS idx_orden_historia ON lab_m_orden(id_historia);