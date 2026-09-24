import { NextRequest } from "next/server";
import { updateLeadSchema } from "@/lib/validations/lead";
import { getLeadById, updateLead, deleteLead } from "@/lib/services/lead.service";
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
    const lead = await getLeadById(id);
    if (!lead) return notFoundResponse("Lead not found");
    return successResponse(lead);
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
    const parsed = updateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }
    const existing = await getLeadById(id);
    if (!existing) return notFoundResponse("Lead not found");
    const lead = await updateLead(id, parsed.data);
    return successResponse(lead);
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
    const existing = await getLeadById(id);
    if (!existing) return notFoundResponse("Lead not found");
    await deleteLead(id);
    return successResponse({ message: "Lead deleted successfully" });
  } catch (err) {
    return serverErrorResponse(err);
  }
}