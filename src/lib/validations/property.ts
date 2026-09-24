import { z } from "zod";

export const createPropertySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  type: z.enum(["APARTMENTS", "VILLAS", "PLOTS", "COMMERCIAL"]),
  status: z
    .enum(["READY_TO_MOVE", "UNDER_CONSTRUCTION", "NEW_LAUNCH", "SOLD_OUT"])
    .optional()
    .default("UNDER_CONSTRUCTION"),
  price: z.coerce.number().positive("Price must be a positive number"),
  priceLabel: z.string().min(1, "Price label is required"),
  bedrooms: z.string().optional(),
  area: z.string().optional(),
  description: z.string().optional(),
  totalUnits: z.coerce.number().int().min(0).optional().default(0),
  availableUnits: z.coerce.number().int().min(0).optional().default(0),
  possessionDate: z.string().optional(),
  bannerGradient: z.string().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyQuerySchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  location: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyQuery = z.infer<typeof propertyQuerySchema>;
