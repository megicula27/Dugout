// pages/api/update-user-status.js
import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";
import { getToken } from "next-auth/jwt";

export const POST = async (req) => {
  try {
    // Get the token to identify the user
    const token = await getToken({ req });
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Connect to the database
    await dbConnect();

    // Update the user's active status
    const userFromDB = await User.findOne({ email: token.email });
    if (userFromDB) {
      userFromDB.activeStatus = false;
      await userFromDB.save();
      console.log("User status updated to inactive.");
      return new Response(JSON.stringify({ message: "User status updated" }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
