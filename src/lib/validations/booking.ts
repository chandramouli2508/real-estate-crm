import { z } from "zod";

export const createBookingSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  propertyId: z.string().min(1, "Property ID is required"),
  bookingDate: z.string().datetime("Invalid booking date"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional().default("PENDING"),
  notes: z.string().optional(),
});

export const updateBookingSchema = createBookingSchema.partial();

export const bookingQuerySchema = z.object({
  leadId: z.string().optional(),
  propertyId: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type BookingQuery = z.infer<typeof bookingQuerySchema>;
