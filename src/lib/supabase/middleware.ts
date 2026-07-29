import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_HOME: Record<string, string> = {
  admin: "/a/dashboard",
  guru: "/g/dashboard",
  murid: "/m/dashboard",
};

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = path.startsWith("/a") || path.startsWith("/g") || path.startsWith("/m");
  const isAuthPage = path === "/login" || path === "/register" || path === "/register-sekolah";

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isProtected && user) {
    const role = user.user_metadata?.role as string | undefined;
    if (role && ROLE_HOME[role] && !path.startsWith(ROLE_HOME[role].split("/").slice(0, 2).join("/"))) {
      const url = request.nextUrl.clone();
      url.pathname = ROLE_HOME[role];
      return NextResponse.redirect(url);
    }
  }

  if (isAuthPage && user) {
    const role = user.user_metadata?.role as string | undefined;
    const url = request.nextUrl.clone();
    url.pathname = (role && ROLE_HOME[role]) || "/m/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}
