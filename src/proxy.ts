import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/pricing"];
const PUBLIC_PREFIXES = [
  "/_next",
  "/favicon",
  "/api",
  "/background",
  "/subjects",
  "/login-artwork",
  "/logo",
  "/dream1",
  "/faces",
  "/fonts",
];
const PUBLIC_FILE_EXTENSIONS =
  /\.(?:avif|bmp|css|gif|ico|jpe?g|js|json|map|mjs|mp3|mp4|otf|pdf|png|svg|ttf|txt|wav|webm|webmanifest|webp|woff2?|xml)$/i;

function isPublicFile(pathname: string) {
  return PUBLIC_FILE_EXTENSIONS.test(pathname);
}

const DEV_SECRET = "dev-secret-change-in-production-please";

function getJwtSecret() {
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required in production.");
  }
  return new TextEncoder().encode(process.env.JWT_SECRET || DEV_SECRET);
}

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session_v2")?.value;
  const authenticated = await isValidSession(token);

  // Allow public paths
  if (
    isPublicFile(pathname) ||
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    // Redirect authenticated users away from login/signup to dashboard
    if (authenticated && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Redirect authenticated users from landing to dashboard
    if (authenticated && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Block unauthenticated access to protected routes
  if (!authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
