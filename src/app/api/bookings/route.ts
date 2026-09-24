import { NextRequest } from "next/server";
import { bookingQuerySchema, createBookingSchema } from "@/lib/validations/booking";
import { getBookings, createBooking } from "@/lib/services/booking.service";
import {
  createdResponse,
  errorResponse,
  serverErrorResponse,
  paginatedResponse,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const query = bookingQuerySchema.safeParse({
      leadId: sp.get("leadId") ?? undefined,
      propertyId: sp.get("propertyId") ?? undefined,
      status: sp.get("status") ?? undefined,
      page: sp.get("page") ?? undefined,
      limit: sp.get("limit") ?? undefined,
    });

    if (!query.success) {
      return errorResponse(query.error.issues[0].message);
    }

    const { bookings, total } = await getBookings(query.data);
    return paginatedResponse(bookings, total, query.data.page, query.data.limit);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const booking = await createBooking(parsed.data);
    return createdResponse(booking);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

