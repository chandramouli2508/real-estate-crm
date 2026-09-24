import { NextRequest } from "next/server";
import { updatePropertySchema } from "@/lib/validations/property";
import { getPropertyById, updateProperty, deleteProperty } from "@/lib/services/property.service";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/lib/api-response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);
    if (!property) return notFoundResponse("Property not found");
    return successResponse(property);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updatePropertySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }
    const existing = await getPropertyById(id);
    if (!existing) return notFoundResponse("Property not found");
    const property = await updateProperty(id, parsed.data);
    return successResponse(property);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(req, { params });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await getPropertyById(id);
    if (!existing) return notFoundResponse("Property not found");
    await deleteProperty(id);
    return successResponse({ message: "Property deleted successfully" });
  } catch (err) {
    return serverErrorResponse(err);
  }
}