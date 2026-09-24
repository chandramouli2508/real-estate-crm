import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JwtPayload } from "./jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: JwtPayload;
}

/**
 * Extracts and verifies JWT from Authorization header or cookie.
 * Returns the decoded payload or null if invalid.
 */
export function getAuthUser(req: NextRequest): JwtPayload | null {
  try {
    // Try Authorization header first
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      return verifyToken(token);
    }

    // Fallback to cookie
    const tokenCookie = req.cookies.get("crm_token")?.value;
    if (tokenCookie) {
      return verifyToken(tokenCookie);
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Returns a 401 unauthorized response.
 */
export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Returns a 403 forbidden response.
 */
export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}
