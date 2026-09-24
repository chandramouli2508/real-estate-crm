import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

export async function GET(_req: NextRequest) {
  try {
    const [
      totalLeads,
      newLeads,
      bookedLeads,
      totalProperties,
      availableProperties,
      totalBookings,
      confirmedBookings,
      recentLeads,
      recentBookings,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { status: "BOOKED" } }),
      prisma.property.count(),
      prisma.property.count({ where: { status: { not: "SOLD_OUT" } } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, status: true, source: true, createdAt: true },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          lead: { select: { name: true } },
          property: { select: { name: true } },
        },
      }),
    ]);

    return successResponse({
      stats: {
        totalLeads,
        newLeads,
        bookedLeads,
        totalProperties,
        availableProperties,
        totalBookings,
        confirmedBookings,
      },
      recentLeads,
      recentBookings,
    });
  } catch (err) {
    return serverErrorResponse(err);
  }
}

