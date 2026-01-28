import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // clear cookies (names must match your cookies)
  res.cookies.set("authToken", "", { path: "/", maxAge: 0 });
  res.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });

  return res;
}
