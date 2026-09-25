import { z } from "zod";

function normalizeTypeInput(val: unknown): string {
  if (typeof val !== "string") return val as string;
  const s = val.trim().toUpperCase();
  if (s === "APARTMENTS" || s === "APARTMENT") return "APARTMENTS";
  if (s === "VILLAS" || s === "VILLA") return "VILLAS";
  if (s === "PLOTS" || s === "PLOT") return "PLOTS";
  if (s === "COMMERCIAL") return "COMMERCIAL";
  return s;
}

function normalizeStatusInput(val: unknown): string {
  if (typeof val !== "string") return val as string;
  const s = val.trim().toUpperCase().replace(/\s+/g, "_");
  if (s === "READY_TO_MOVE") return "READY_TO_MOVE";
  if (s === "UNDER_CONSTRUCTION") return "UNDER_CONSTRUCTION";
  if (s === "NEW_LAUNCH") return "NEW_LAUNCH";
  if (s === "SOLD_OUT") return "SOLD_OUT";
  return s;
}

export const createPropertySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  type: z.preprocess(
    normalizeTypeInput,
    z.enum(["APARTMENTS", "VILLAS", "PLOTS", "COMMERCIAL"], {
      message: 'Invalid option: expected one of "APARTMENTS"|"VILLAS"|"PLOTS"|"COMMERCIAL"',
    })
  ),
  status: z.preprocess(
    normalizeStatusInput,
    z
      .enum(["READY_TO_MOVE", "UNDER_CONSTRUCTION", "NEW_LAUNCH", "SOLD_OUT"])
      .optional()
      .default("UNDER_CONSTRUCTION")
  ),
  price: z.coerce.number().positive("Price must be a positive number"),
  priceLabel: z.string().min(1, "Price label is required"),
  bedrooms: z.string().optional(),
  area: z.string().optional(),
  description: z.string().optional(),
  totalUnits: z.coerce.number().int().min(0).optional().default(0),
  availableUnits: z.coerce.number().int().min(0).optional().default(0),
  possessionDate: z.string().optional(),
  bannerGradient: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  imagePublicId: z.string().optional().nullable(),
  developer: z.string().optional().nullable(),
  reraId: z.string().optional().nullable(),
  amenities: z.string().optional().nullable(),
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
