import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";

import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "User already exists",
        },
        { status: 400 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        body.password,
        10
      );

    const user =
      await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password:
            hashedPassword,
        },
      });

    return NextResponse.json(
      user
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Registration failed",
      },
      { status: 500 }
    );
  }
}