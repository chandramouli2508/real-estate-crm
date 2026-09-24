import { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { registerUser } from "@/lib/services/auth.service";
import { createdResponse, errorResponse, serverErrorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const result = await registerUser(parsed.data);
    return createdResponse(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("already exists")) {
      return errorResponse(err.message, 409);
    }
    return serverErrorResponse(err);
  }
}

