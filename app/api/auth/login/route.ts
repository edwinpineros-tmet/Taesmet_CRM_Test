import { NextResponse } from 'next/server';
// 1. Añadimos "type CookieOptions" a la importación de Supabase
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // 2. Definimos la estructura exacta que TypeScript está pidiendo
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error || !data.url) {
    console.error('OAuth init error:', error);
    return NextResponse.redirect(`${origin}/login?error=oauth_init_error`);
  }

  // Build response that redirects to Google AND carries the PKCE cookie
  const response = NextResponse.redirect(data.url);

  // Copy all cookies set during signInWithOAuth to the redirect response
  cookieStore.getAll().forEach(({ name, value }) => {
    response.cookies.set(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  });

  return response;
}