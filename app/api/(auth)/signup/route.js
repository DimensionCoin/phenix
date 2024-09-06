import { NextResponse } from "next/server";
import prisma from "../../../../pirsmaClient";
import { Keypair } from "@solana/web3.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { encrypt } from "../../../../utils/crypto";
import bs58 from "bs58"; // Base58 library

export async function POST(request) {
  try {
    const { username, password, privateKey } = await request.json();

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let walletAddress;
    let finalPrivateKey;

    if (privateKey) {
      // Log the provided private key length and value
      console.log("Private Key Provided:", privateKey);
      console.log("Private Key Length:", privateKey.length);

      // Attempt to decode using Base58
      let privateKeyUint8Array;
      try {
        privateKeyUint8Array = bs58.decode(privateKey);
      } catch (err) {
        return NextResponse.json(
          {
            error: "Invalid private key format. Could not decode Base58.",
          },
          { status: 400 }
        );
      }

      // Log the length of the Uint8Array after conversion
      console.log("Uint8Array Length:", privateKeyUint8Array.length);

      // Ensure the private key is 64 bytes long
      if (privateKeyUint8Array.length !== 64) {
        return NextResponse.json(
          { error: "Invalid private key length. Expected 64 bytes." },
          { status: 400 }
        );
      }

      const keypair = Keypair.fromSecretKey(privateKeyUint8Array);
      walletAddress = keypair.publicKey.toString();
      finalPrivateKey = privateKey; // Use the provided private key
    } else {
      // Generate a new keypair
      const keypair = Keypair.generate();
      walletAddress = keypair.publicKey.toString();
      finalPrivateKey = Buffer.from(keypair.secretKey).toString("base64"); // Convert to base64 for storage
    }

    // Encrypt the private key
    const encryptedPrivateKey = encrypt(finalPrivateKey);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        walletAddress,
        privateKey: encryptedPrivateKey.content,
        iv: encryptedPrivateKey.iv, // Storing IV for decryption
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token in cookies
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          walletAddress: user.walletAddress,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
