import { NextRequest } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { loginUser } from "@/lib/services/auth.service";
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const result = await loginUser(parsed.data);
    return successResponse(result);
  } catch (err) {
    if (err instanceof Error && err.message === "Invalid email or password") {
      return errorResponse(err.message, 401);
    }
    return serverErrorResponse(err);
  }
}

