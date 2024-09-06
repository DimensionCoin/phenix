import { NextResponse } from "next/server";
import prisma from "../../../../pirsmaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    console.log("Received login request for username:", username);

    // Find user by username
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      console.log("User not found for username:", username);
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for username:", username);
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated JWT token for username:", username);

    // Set the token in cookies
    const response = NextResponse.json(
      { user: { id: user.id, username: user.username } },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure flag in production
      maxAge: 60 * 60, // 1 hour
      path: "/", // Set path to root to make it available site-wide
    });
    console.log("Set JWT token in cookies for username:", username);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
