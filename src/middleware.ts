import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEFAULT_ADMINS } from './lib/constants';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 1. Security Headers (Apply these even if Supabase is not configured)
  // Temporarily removed CSP to diagnose SyntaxError
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // If Supabase is not configured, we skip auth checks but keep security headers
  if (!supabaseUrl || !supabaseAnonKey) {
    return res;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Route Protection
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin');
  const isApiPath = req.nextUrl.pathname.startsWith('/api');

  if (isAdminPath || (isApiPath && req.method === 'POST')) {
    // If we have a user, check admin status
    if (user) {
      if (isAdminPath) {
        const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
        const ADMIN_EMAILS = Array.from(new Set([
          ...(adminEmailsEnv ? adminEmailsEnv.split(',') : []),
          ...DEFAULT_ADMINS
        ])).map(e => e.trim().toLowerCase()).filter(Boolean);
        
        const userEmail = (user.email || "").toLowerCase();
        if (!ADMIN_EMAILS.includes(userEmail)) {
          return NextResponse.redirect(new URL('/', req.url));
        }
      }
    } 
    // If no user is found in middleware, we DON'T redirect to login here.
    // This avoids redirect loops in environments where cookies are blocked (like iframes).
    // The client-side AdminDashboard component will handle the redirect if needed
    // using the session stored in LocalStorage.
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
