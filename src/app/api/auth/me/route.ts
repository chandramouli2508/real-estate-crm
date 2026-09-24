import { NextRequest } from "next/server";
import { getAuthUser, unauthorizedResponse } from "@/lib/auth/middleware";
import { prisma } from "@/lib/db/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return unauthorizedResponse();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!dbUser) return unauthorizedResponse("User not found");

    return successResponse(dbUser);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

