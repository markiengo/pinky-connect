import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const DEV_SECRET = "dev-secret-change-in-production-please";
const COOKIE_NAME = "session_v2";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const isDev = process.env.NODE_ENV !== "production";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error("JWT_SECRET is required in production.");
  }

  return new TextEncoder().encode(secret || DEV_SECRET);
}

export interface SessionPayload {
  userId: string;
  username: string;
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getJwtSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: isDev ? undefined : MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = getJwtSecret();

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

