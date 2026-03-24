SELECT 
    CLIENTE.Codigo                 AS CodigoCliente,
    CLIENTE.RazonSocial            AS NombreCliente,
    CLIENTE.CIF                    AS NIT,
    CLIENTE.Provincia              AS Provincia,
    CLIENTE.Pais                   AS Pais,
    CLIENTE.PersonaContacto        AS PersonaContacto,
    CLIENTE.Telefono               AS Telefono,
    CLIENTE.DirecCorreoElectronico AS CorreoElectronico,
    
    -- Requieren GROUP BY al final
    MAX(FACTURA.Fecha)             AS FechaUltimaFactura,
    ISNULL(SUM(FACTURA.ImporteBruto), 0) AS TotalVentas,
    
    -- Usar MAX() en el texto largo para no tener que ponerlo en el GROUP BY
    MAX(CAST(CLIENTE.Observaciones AS varchar(max))) AS ObservacionCliente,
    
    CLIENTE.CodigoAgente           AS CodigoAgente,
    AGENTE.NOMBRE                  AS NombreAgente,
    CLIENTE.CodigoSector           AS CodigoSector,
    SECTOR.Descripcion             AS SectorEconomico

FROM CLIENTE
-- 1. Uniones a tablas maestras
LEFT OUTER JOIN AGENTE 
    ON CLIENTE.CodigoAgente = AGENTE.Codigo
LEFT OUTER JOIN SECTOR
    ON CLIENTE.CodigoSector = SECTOR.Codigo

-- 2. Unión a la tabla transaccional
LEFT OUTER JOIN FACTURA 
    ON CLIENTE.Codigo = FACTURA.CodigoCliente
    AND FACTURA.Fecha >= '20100101' -- Formato ISO (YYYYMMDD)
-- WHERE CLIENTE.Activo = 'SI'

-- =========================================================================
-- GROUP BY OBLIGATORIO
-- Todas las columnas del SELECT que NO tienen SUM() ni MAX()
-- =========================================================================
GROUP BY 
    CLIENTE.Codigo,
    CLIENTE.RazonSocial,
    CLIENTE.CIF,
    CLIENTE.Provincia,
    CLIENTE.Pais,
    CLIENTE.PersonaContacto,
    CLIENTE.Telefono,
    CLIENTE.DirecCorreoElectronico,
    CLIENTE.CodigoAgente,
    AGENTE.NOMBRE,
    CLIENTE.CodigoSector,
    SECTOR.Descripcion

ORDER BY 
    CLIENTE.RazonSocial
