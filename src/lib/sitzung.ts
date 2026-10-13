import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "sitzung";
const DAUER_TAGE = 30;

function schluessel() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET fehlt oder ist zu kurz (siehe .env.example).");
  }
  return new TextEncoder().encode(secret);
}

export async function sitzungStarten(benutzerId: number) {
  const token = await new SignJWT({ benutzerId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DAUER_TAGE}d`)
    .sign(schluessel());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: DAUER_TAGE * 24 * 60 * 60,
  });
}

export async function sitzungBeenden() {
  (await cookies()).delete(COOKIE);
}

export async function sitzungLesen(): Promise<number | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, schluessel());
    return typeof payload.benutzerId === "number" ? payload.benutzerId : null;
  } catch {
    return null;
  }
}
