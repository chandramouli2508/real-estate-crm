import { NextRequest } from "next/server";
import { updateBookingSchema } from "@/lib/validations/booking";
import { getBookingById, updateBooking, deleteBooking } from "@/lib/services/booking.service";
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
    const booking = await getBookingById(id);
    if (!booking) return notFoundResponse("Booking not found");
    return successResponse(booking);
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
    const parsed = updateBookingSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }
    const existing = await getBookingById(id);
    if (!existing) return notFoundResponse("Booking not found");
    const booking = await updateBooking(id, parsed.data);
    return successResponse(booking);
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
    const existing = await getBookingById(id);
    if (!existing) return notFoundResponse("Booking not found");
    await deleteBooking(id);
    return successResponse({ message: "Booking deleted successfully" });
  } catch (err) {
    return serverErrorResponse(err);
  }
}