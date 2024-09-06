// app/api/(auth)/check-auth/route.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "../../../../pirsmaClient"; 

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      username: user.username,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt, 
      avatarUrl: user.avatarUrl || null, 
    });
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
