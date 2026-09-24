import { NextRequest } from "next/server";
import { propertyQuerySchema, createPropertySchema } from "@/lib/validations/property";
import { getProperties, createProperty } from "@/lib/services/property.service";
import {
  createdResponse,
  errorResponse,
  serverErrorResponse,
  paginatedResponse,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const query = propertyQuerySchema.safeParse({
      search: sp.get("search") ?? undefined,
      type: sp.get("type") ?? undefined,
      status: sp.get("status") ?? undefined,
      location: sp.get("location") ?? undefined,
      minPrice: sp.get("minPrice") ?? undefined,
      maxPrice: sp.get("maxPrice") ?? undefined,
      page: sp.get("page") ?? undefined,
      limit: sp.get("limit") ?? undefined,
    });

    if (!query.success) {
      return errorResponse(query.error.issues[0].message);
    }

    const { properties, total } = await getProperties(query.data);
    return paginatedResponse(properties, total, query.data.page, query.data.limit);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createPropertySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const property = await createProperty(parsed.data);
    return createdResponse(property);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

