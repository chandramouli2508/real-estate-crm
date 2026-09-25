import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true,
  });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function checkIsConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
     process.env.CLOUDINARY_API_KEY &&
     process.env.CLOUDINARY_API_SECRET)
  );
}

/**
 * Validates actual File Buffer for size (max 2MB) and magic bytes (PNG / JPG signatures)
 */
export function validateImageBuffer(buffer: Buffer): { valid: boolean; error?: string } {
  const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

  if (buffer.length > MAX_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed limit of 2 MB (received ${(buffer.length / (1024 * 1024)).toFixed(2)} MB).`,
    };
  }

  if (buffer.length < 4) {
    return { valid: false, error: "File data is invalid or empty." };
  }

  // Check Magic Bytes (File signatures)
  // PNG signature: 89 50 4E 47
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;

  // JPEG / JPG signature: FF D8 FF
  const isJpg =
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

  if (!isPng && !isJpg) {
    return {
      valid: false,
      error: "Invalid file format signature. Only genuine PNG and JPG/JPEG image files are permitted.",
    };
  }

  return { valid: true };
}

export interface UploadResult {
  secureUrl: string;
  publicId: string;
}

/**
 * Uploads file buffer directly to Cloudinary.
 * Returns Cloudinary secure_url and public_id.
 * Throws an Error if Cloudinary is unconfigured or upload fails.
 */
export async function uploadImageToCloudinary(
  buffer: Buffer,
  folder = "real-estate-crm/properties"
): Promise<UploadResult> {
  if (!checkIsConfigured()) {
    throw new Error(
      "Cloudinary credentials are not configured in environment variables (.env)."
    );
  }

  return new Promise<UploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "png", "jpeg"],
      },
      (error, result) => {
        if (error || !result) {
          const msg = error?.message || "Cloudinary image upload failed.";
          if (msg.includes("Invalid cloud_name")) {
            return reject(
              new Error(
                `Cloudinary Error: The cloud name "${process.env.CLOUDINARY_CLOUD_NAME}" in your .env file is invalid. Please update CLOUDINARY_CLOUD_NAME with your valid Cloudinary account Cloud Name.`
              )
            );
          }
          return reject(new Error(msg));
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Safely deletes an image asset from Cloudinary
 */
export async function deleteImageFromCloudinary(publicId?: string | null): Promise<boolean> {
  if (!publicId) return true;

  if (!checkIsConfigured()) return true;

  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok" || res.result === "not found";
  } catch (err) {
    console.error("Cloudinary deletion error:", err);
    return false;
  }
}
