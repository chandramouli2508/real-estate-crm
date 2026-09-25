import { NextRequest } from "next/server";
import { propertyQuerySchema, createPropertySchema } from "@/lib/validations/property";
import { getProperties, createProperty } from "@/lib/services/property.service";
import { validateImageBuffer, uploadImageToCloudinary } from "@/lib/cloudinary";
import {
  createdResponse,
  errorResponse,
  serverErrorResponse,
  paginatedResponse,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const query = propertyQuerySchema.safeParse({
      search: sp.get("search") ?? undefined,
      type: sp.get("type") ?? undefined,
      status: sp.get("status") ?? undefined,
      location: sp.get("location") ?? undefined,
      minPrice: sp.get("minPrice") ?? undefined,
      maxPrice: sp.get("maxPrice") ?? undefined,
      page: sp.get("page") ?? undefined,
      limit: sp.get("limit") ?? undefined,
    });

    if (!query.success) {
      return errorResponse(query.error.issues[0].message);
    }

    const { properties, total } = await getProperties(query.data);
    return paginatedResponse(properties, total, query.data.page, query.data.limit);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let dataToValidate: any = {};
    let uploadResult: { secureUrl: string; publicId: string } | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const jsonStr = formData.get("data") as string | null;

      if (jsonStr) {
        try {
          dataToValidate = JSON.parse(jsonStr);
        } catch (_) {
          return errorResponse("Invalid JSON data format.");
        }
      } else {
        // Fallback if fields are sent directly as form data
        dataToValidate = {
          name: formData.get("name") || formData.get("title"),
          location: formData.get("location"),
          type: formData.get("type"),
          status: formData.get("status"),
          price: formData.get("price"),
          priceLabel: formData.get("priceLabel") || `₹${formData.get("price")} Cr`,
          bedrooms: formData.get("bedrooms") || formData.get("specs"),
          area: formData.get("area") || formData.get("areaRange"),
          description: formData.get("description"),
          totalUnits: formData.get("totalUnits"),
          availableUnits: formData.get("availableUnits"),
          possessionDate: formData.get("possessionDate"),
          developer: formData.get("developer"),
          reraId: formData.get("reraId"),
          amenities: formData.get("amenities"),
        };
      }

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Strict Backend Magic Byte & 2MB Validation
        const validation = validateImageBuffer(buffer);
        if (!validation.valid) {
          return errorResponse(validation.error || "Image validation failed.");
        }

        uploadResult = await uploadImageToCloudinary(buffer);
        dataToValidate.imageUrl = uploadResult.secureUrl;
        dataToValidate.imagePublicId = uploadResult.publicId;
      }
    } else {
      const body = await req.json();
      dataToValidate = { ...body };
      // Strip any raw Base64 strings if sent directly in JSON body
      if (typeof dataToValidate.imageUrl === "string" && dataToValidate.imageUrl.startsWith("data:image/")) {
        delete dataToValidate.imageUrl;
      }
    }

    const parsed = createPropertySchema.safeParse(dataToValidate);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const property = await createProperty(parsed.data);
    return createdResponse(property);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

