import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

// GET SINGLE PRODUCT
export async function GET(
  req: Request,
  { params }: Params
) {
  try {
    const product =
      await prisma.product.findUnique({
        where: {
          id: params.id,
        },
      });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// UPDATE PRODUCT
export async function PUT(
  req: Request,
  { params }: Params
) {
  try {
    const body = await req.json();

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: params.id,
        },

        data: {
          title: body.title,
          description:
            body.description,
          price: body.price,
          image: body.image,
          category: body.category,
          stock: body.stock,
        },
      });

    return NextResponse.json(
      updatedProduct
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE PRODUCT
export async function DELETE(
  req: Request,
  { params }: Params
) {
  try {
    await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}