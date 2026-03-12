-- 1. Tabla de Usuarios (Sincronizada con auth.users de Supabase)
CREATE TABLE Usuarios (
    -- El id debe ser UUID para vincularse con la tabla auth.users de Supabase
    Id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    Email TEXT UNIQUE NOT NULL,
    NombreCompleto TEXT NOT NULL,
    CodigoOperario INTEGER UNIQUE,
    Rol TEXT CHECK (Rol IN ('Vendedor', 'Lider Comercial', 'Administrador')),
    Departamento TEXT CHECK (Departamento IN ('Rejillas', 'Estructuras')),
    Estado TEXT DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo'))
);

-- 2. Tabla de Clientes
CREATE TABLE Clientes (
    NIT BIGINT PRIMARY KEY,
    RazonSocial TEXT,
    TipoCliente TEXT CHECK (TipoCliente IN ('Empresa', 'Persona')),
    CodigoCliente INTEGER UNIQUE,
    SectorCIIU TEXT,
    PropietarioCuenta UUID REFERENCES Usuarios(id),
    EmailContactoCuenta TEXT,
    FechaCreacionCliente TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Contactos
CREATE TABLE Contactos (
    IdContacto SERIAL PRIMARY KEY,
    NombreContacto VARCHAR(255) NOT NULL,
    ClienteAsociado BIGINT,
    Cargo VARCHAR(100),
    Telefono VARCHAR(50),
    Correo VARCHAR(255),
    FechaCreacionContacto TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ClienteAsociado) REFERENCES Clientes(NIT)
);

-- 4. Tabla de Oportunidades
CREATE TABLE Oportunidades (
    IdOportunidad SERIAL PRIMARY KEY,
    TituloNegocio VARCHAR(255),
    ClienteAsociado BIGINT,
    Departamento VARCHAR(100),
    Etapa TEXT CHECK (Etapa IN (
        '1. Prospección', 
        '2. Negociación', 
        '3. Cotización', 
        '4. Cierre Ganado', 
        '5. Cierre Perdido'
    )),
    NivelInteres TEXT CHECK (NivelInteres IN ('Alto', 'Medio', 'Bajo')),
    MontoEstimado DECIMAL(15, 2),
    PaisDestinoVenta TEXT,
    CiudadDestinoVenta TEXT,
    FechaCreacionOportunidad TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ClienteAsociado) REFERENCES Clientes(NIT)
);

-- 5. Tabla Detalle Cotización
CREATE TABLE DetalleCotizacion (
    IdDetalle SERIAL PRIMARY KEY,
    NegocioAsociado INTEGER,
    CategoriaProducto TEXT CHECK (CategoriaProducto IN (
        'Cárcamos', 
        'Rejillas', 
        'Estructura Metálica', 
        'Pernos'
    )),
    Descripcion TEXT,
    CantidadUnidades INT,
    CantidadKilos INT,
    CantidadMetros INT,
    CantidadArea INT,
    FOREIGN KEY (NegocioAsociado) REFERENCES Oportunidades(IdOportunidad)
);

-- 6. Registro de Actividades
CREATE TABLE RegistroActividades (
    IdActividad SERIAL PRIMARY KEY,
    NegocioAsociado INTEGER,
    TipoInteraccion TEXT CHECK (TipoInteraccion IN (
        'Llamada', 
        'Correo', 
        'Reunión Presencial', 
        'Videollamada', 
        'WhatsApp'
    )),
    FechaHora TIMESTAMP,
    Notas TEXT,
    FechaProximoSeguimiento TIMESTAMP,
    FOREIGN KEY (NegocioAsociado) REFERENCES Oportunidades(IdOportunidad)
);
