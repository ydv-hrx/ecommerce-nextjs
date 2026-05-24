import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const uploadedResponse = await cloudinary.uploader.upload(
      body.image,
      {
        folder: "ecommerce-products",
      }
    );

    return NextResponse.json({
      imageUrl: uploadedResponse.secure_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }
}