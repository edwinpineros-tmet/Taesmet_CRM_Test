SELECT 
    -- LLaves del Presupuesto
    PROYECTP.Anyo                    AS Anio,
    PROYECTP.Numero                  AS NumeroPresupuesto,
    PROYECTP.Version                 AS Version,
    
    -- Información del Cliente
    PROYECTP.CodigoCliente           AS CodigoCliente,
    PROYECTP.RazonSocial             AS NombreCliente,
    PROYECTP.NombreClienteFinal      AS ClienteFinal,
    PROYECTP.PersonaContacto         AS PersonaContacto,
    
    -- Trazabilidad y Fechas
    PROYECTP.FechaRealizacion        AS FechaCotizacion,
    PROYECTP.Seguimiento             AS Seguimiento,
    CAST(PROYECTP.Descripcion AS varchar(max))  AS ObservacionProyecto,
    CAST(PROYECTP.Observaciones AS varchar(max)) AS TiempoEstimadoObservaciones,
    
    -- Responsables
    PROYECTP.CodigoDirectorComercial AS CodigoDirector,
    OPERARIO.Nombre                  AS DirectorComercial,
    
    -- Estado de la Cotización
    PROYECTP.Estado                  AS EstadoPresupuesto,
    
    -- Datos Financieros
    PROYECTP.CodigoFPago             AS CodigoFormaPago,
    FPAGO.Descripcion                AS FormaPago,
    
    ROUND(PROYECTP.CantidadUnidadPrecioVenta, 2) AS Unidades,
    ROUND(PROYECTP.PrecioUnitarioVenta, 2)       AS PrecioUnitario,
    
    -- SUBTOTAL
    ROUND(PROYECTP.TotalOfertaDefinitiva, 2)     AS Subtotal,
    
    -- ====================================================================
    -- CÁLCULO DE IVA CORREGIDO:
    -- Como la tabla no guarda el % de IVA, asumimos un 19% estándar (0.19).
    -- Si aplica un IVA distinto, cambia el 0.19 por el valor correcto.
    -- ====================================================================
    19 AS PorcentajeIVA_Aplicado,
    ROUND(PROYECTP.TotalOfertaDefinitiva * 0.19, 2) AS ValorIVA_Calculado

FROM PROYECTP
-- Join para el nombre del Director Comercial
LEFT OUTER JOIN OPERARIO 
    ON PROYECTP.CodigoDirectorComercial = OPERARIO.Codigo

-- Join para el texto de la Forma de Pago
LEFT OUTER JOIN FPAGO 
    ON PROYECTP.CodigoFPago = FPAGO.Codigo

WHERE 
    PROYECTP.FechaRealizacion >= '20240101' -- Formato ISO
    -- AND PROYECTP.Version = PROYECTP.VersionAceptada

ORDER BY 
    PROYECTP.FechaRealizacion DESC, 
    PROYECTP.Numero