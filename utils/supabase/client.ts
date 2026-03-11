import { createBrowserClient } from '@supabase/ssr'
// Importar el diccionario que acabamos de crear
import { Database } from '../../types/supabase'

export function createClient() {
  // Pasar <Database> a la función
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      isSingleton: true,
    }
  )
}