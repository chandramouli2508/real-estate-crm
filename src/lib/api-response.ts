import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function createdResponse<T>(data: T) {
  return successResponse(data, 201);
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function notFoundResponse(message = "Resource not found") {
  return errorResponse(message, 404);
}

export function serverErrorResponse(error?: unknown) {
  const message =
    process.env.NODE_ENV === "development" && error instanceof Error
      ? error.message
      : "Internal server error";
  return errorResponse(message, 500);
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    },
    { status }
  );
}
