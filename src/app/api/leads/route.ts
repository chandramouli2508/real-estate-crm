import { NextRequest } from "next/server";
import { leadQuerySchema, createLeadSchema } from "@/lib/validations/lead";
import { getLeads, createLead } from "@/lib/services/lead.service";
import {
  successResponse,
  createdResponse,
  errorResponse,
  serverErrorResponse,
  paginatedResponse,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const query = leadQuerySchema.safeParse({
      search: sp.get("search") ?? undefined,
      status: sp.get("status") ?? undefined,
      source: sp.get("source") ?? undefined,
      assignedTo: sp.get("assignedTo") ?? undefined,
      page: sp.get("page") ?? undefined,
      limit: sp.get("limit") ?? undefined,
    });

    if (!query.success) {
      return errorResponse(query.error.issues[0].message);
    }

    const { leads, total } = await getLeads(query.data);
    return paginatedResponse(leads, total, query.data.page, query.data.limit);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createLeadSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const lead = await createLead(parsed.data);
    return createdResponse(lead);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

