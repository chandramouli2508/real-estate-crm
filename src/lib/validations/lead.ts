import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(7, "Phone number is required"),
  source: z.enum(["WEBSITE", "ACRES_99", "MAGICBRICKS", "REFERRAL", "WALK_IN", "HOUSING_COM"]),
  status: z
    .enum(["NEW", "CONTACTED", "SITE_VISIT", "INTERESTED", "NEGOTIATION", "BOOKED", "LOST"])
    .optional()
    .default("NEW"),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
  project: z.string().optional(),
  budget: z.string().optional(),
  followUp: z.string().datetime().optional(),
  urgent: z.boolean().optional().default(false),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  assignedTo: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQuery = z.infer<typeof leadQuerySchema>;
