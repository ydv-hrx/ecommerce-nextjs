import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    // Find user
    const user =
      await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

    // Invalid user
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Check password
    const validPassword =
      await bcrypt.compare(
        body.password,
        user.password
      );

    if (!validPassword) {
      return NextResponse.json(
        {
          error:
            "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },

      process.env.JWT_SECRET!,

      {
        expiresIn: "7d",
      }
    );

    // Create response
    const response =
      NextResponse.json({
        success: true,
        token,
        user,
      });

    // Set secure cookie
    response.cookies.set(
      "token",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "strict",

        maxAge:
          60 * 60 * 24 * 7,

        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Login failed",
      },
      { status: 500 }
    );
  }
}