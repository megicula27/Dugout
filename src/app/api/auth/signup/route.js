import bcrypt from "bcrypt";
import User from "@/models/users/User";
import dbConnect from "@/lib/database/mongo";
import { NextResponse } from "next/server";
import { generateUserId } from "@/utils/idGenerator";
export async function POST(request) {
  try {
    await dbConnect();

    // Parse the request body
    const body = await request.json();
    const { username, email, password } = body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = generateUserId();

    // Create user
    const user = new User({
      uid,
      username,
      email,
      password: hashedPassword,
      activeStatus: true, // Set default or calculated values
      teams: [], // Default teams array
      games: [],
    });

    await user.save();

    return NextResponse.json(
      { success: true, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
