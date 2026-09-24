import { NextRequest } from "next/server";
import { getUsers } from "@/lib/services/auth.service";
import { getAuthUser, unauthorizedResponse } from "@/lib/auth/middleware";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse();

    const users = await getUsers();
    return successResponse(users);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

