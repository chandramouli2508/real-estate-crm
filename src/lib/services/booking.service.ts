import { prisma } from "@/lib/db/prisma";
import { CreateBookingInput, UpdateBookingInput, BookingQuery } from "@/lib/validations/booking";
import { Prisma } from "@prisma/client";

export async function getBookings(query: BookingQuery) {
  const { leadId, propertyId, status, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.BookingWhereInput = {};

  if (leadId) where.leadId = leadId;
  if (propertyId) where.propertyId = propertyId;
  if (status && status !== "all") {
    where.status = status;
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      include: {
        lead: { select: { id: true, name: true, phone: true, email: true } },
        property: { select: { id: true, name: true, location: true, type: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, total };
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: { lead: true, property: true },
  });
}

export async function createBooking(data: CreateBookingInput) {
  return prisma.booking.create({
    data: {
      ...data,
      bookingDate: new Date(data.bookingDate),
    },
    include: {
      lead: { select: { id: true, name: true } },
      property: { select: { id: true, name: true } },
    },
  });
}

export async function updateBooking(id: string, data: UpdateBookingInput) {
  return prisma.booking.update({
    where: { id },
    data: {
      ...data,
      bookingDate: data.bookingDate ? new Date(data.bookingDate) : undefined,
    },
  });
}

export async function deleteBooking(id: string) {
  return prisma.booking.delete({ where: { id } });
}
