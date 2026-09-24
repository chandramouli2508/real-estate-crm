import { prisma } from "@/lib/db/prisma";
import { CreatePropertyInput, UpdatePropertyInput, PropertyQuery } from "@/lib/validations/property";
import { Prisma } from "@prisma/client";

export async function getProperties(query: PropertyQuery) {
  const { search, type, status, minPrice, maxPrice, location, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.PropertyWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { location: { contains: search } },
    ];
  }

  if (type && type !== "all") {
    where.type = type;
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (location) {
    where.location = { contains: location };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.count({ where }),
  ]);

  return { properties, total };
}

export async function getPropertyById(id: string) {
  return prisma.property.findUnique({
    where: { id },
    include: {
      bookings: {
        include: {
          lead: { select: { id: true, name: true, phone: true } },
        },
      },
    },
  });
}

export async function createProperty(data: CreatePropertyInput) {
  return prisma.property.create({ data });
}

export async function updateProperty(id: string, data: UpdatePropertyInput) {
  return prisma.property.update({ where: { id }, data });
}

export async function deleteProperty(id: string) {
  return prisma.property.delete({ where: { id } });
}
