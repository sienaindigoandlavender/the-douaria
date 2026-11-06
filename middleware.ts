import { NextResponse, type NextRequest } from "next/server";

// ii.riaddisiena.com (Jacqueline, 6 Nov 2026): the home page of that address is the Riad di Siena II page.
export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase();
  if (host.startsWith("ii.") && req.nextUrl.pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/riad-di-siena-ii";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/"] };
