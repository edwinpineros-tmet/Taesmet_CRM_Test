-- ============================================================
-- MIGRACIÓN: Agregar propietariocuenta a la tabla oportunidades
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE oportunidades
ADD COLUMN IF NOT EXISTS propietariocuenta UUID REFERENCES usuarios(id);

-- (Opcional) Si ya tienes oportunidades sin propietario y quieres asignarlas:
-- UPDATE oportunidades 
-- SET propietariocuenta = '<UUID_DEL_VENDEDOR>'
-- WHERE propietariocuenta IS NULL;
