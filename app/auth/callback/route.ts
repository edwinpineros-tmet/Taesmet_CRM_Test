import { NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // --- DIAGNÓSTICO: Rastreador de Cookies ---
  console.log("=== INICIANDO CALLBACK ===");
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  console.log(`Encontramos ${allCookies.length} cookies enviadas por el navegador:`);
  allCookies.forEach(c => console.log(`- ${c.name}`));
  console.log("============================");

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log("¡Sesión de Google intercambiada con éxito!");
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("Error al intercambiar la sesión:", error);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_error`)
}