import { prisma } from "@/lib/db/prisma";
import { CreateLeadInput, UpdateLeadInput, LeadQuery } from "@/lib/validations/lead";
import { Prisma } from "@prisma/client";

export async function getLeads(query: LeadQuery) {
  const { search, status, source, assignedTo, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.LeadWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { project: { contains: search } },
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (source && source !== "all") {
    where.source = source;
  }

  if (assignedTo) {
    where.assignedTo = assignedTo;
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      include: { agent: { select: { id: true, name: true, email: true } } },
      orderBy: [{ urgent: "desc" }, { createdAt: "desc" }],
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total };
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      agent: { select: { id: true, name: true, email: true } },
      bookings: {
        include: {
          property: { select: { id: true, name: true, location: true } },
        },
      },
    },
  });
}

export async function createLead(data: CreateLeadInput) {
  return prisma.lead.create({
    data: {
      ...data,
      email: data.email || null,
      followUp: data.followUp ? new Date(data.followUp) : null,
    },
    include: { agent: { select: { id: true, name: true } } },
  });
}

export async function updateLead(id: string, data: UpdateLeadInput) {
  return prisma.lead.update({
    where: { id },
    data: {
      ...data,
      followUp: data.followUp ? new Date(data.followUp) : undefined,
    },
    include: { agent: { select: { id: true, name: true } } },
  });
}

export async function deleteLead(id: string) {
  return prisma.lead.delete({ where: { id } });
}
