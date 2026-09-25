import { NextRequest } from "next/server";
import { updatePropertySchema } from "@/lib/validations/property";
import { getPropertyById, updateProperty, deleteProperty } from "@/lib/services/property.service";
import { validateImageBuffer, uploadImageToCloudinary, deleteImageFromCloudinary } from "@/lib/cloudinary";
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
    const property = await getPropertyById(id);
    if (!property) return notFoundResponse("Property not found");
    return successResponse(property);
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
    const existing = await getPropertyById(id);
    if (!existing) return notFoundResponse("Property not found");

    const contentType = req.headers.get("content-type") || "";
    let dataToValidate: any = {};
    let newUploadResult: { secureUrl: string; publicId: string } | null = null;
    let newBuffer: Buffer | null = null;

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
        dataToValidate = {
          name: formData.get("name") || formData.get("title"),
          location: formData.get("location"),
          type: formData.get("type"),
          status: formData.get("status"),
          price: formData.get("price"),
          priceLabel: formData.get("priceLabel"),
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
        newBuffer = Buffer.from(arrayBuffer);
      }
    } else {
      const body = await req.json();
      dataToValidate = { ...body };
      if (typeof dataToValidate.imageUrl === "string" && dataToValidate.imageUrl.startsWith("data:image/")) {
        delete dataToValidate.imageUrl;
      }
    }

    // Process new image if provided
    if (newBuffer) {
      const validation = validateImageBuffer(newBuffer);
      if (!validation.valid) {
        return errorResponse(validation.error || "Image validation failed.");
      }

      // Step 1: Upload new image to Cloudinary first
      newUploadResult = await uploadImageToCloudinary(newBuffer);
      dataToValidate.imageUrl = newUploadResult.secureUrl;
      dataToValidate.imagePublicId = newUploadResult.publicId;
    }

    const parsed = updatePropertySchema.safeParse(dataToValidate);
    if (!parsed.success) {
      // If validation fails after uploading new image, clean up new upload
      if (newUploadResult) {
        await deleteImageFromCloudinary(newUploadResult.publicId);
      }
      return errorResponse(parsed.error.issues[0].message);
    }

    try {
      // Step 2: Update database record
      const updatedProperty = await updateProperty(id, parsed.data);

      // Step 3: ONLY after DB update succeeds, clean up previous image asset
      if (newUploadResult && existing.imagePublicId && existing.imagePublicId !== newUploadResult.publicId) {
        await deleteImageFromCloudinary(existing.imagePublicId);
      }

      return successResponse(updatedProperty);
    } catch (dbErr) {
      // If DB update fails, clean up new upload to avoid orphan image in cloud
      if (newUploadResult) {
        await deleteImageFromCloudinary(newUploadResult.publicId);
      }
      throw dbErr;
    }
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
    const existing = await getPropertyById(id);
    if (!existing) return notFoundResponse("Property not found");

    await deleteProperty(id);

    // Delete associated image from Cloudinary
    if (existing.imagePublicId) {
      await deleteImageFromCloudinary(existing.imagePublicId);
    }

    return successResponse({ message: "Property deleted successfully" });
  } catch (err) {
    return serverErrorResponse(err);
  }
}