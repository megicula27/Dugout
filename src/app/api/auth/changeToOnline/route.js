// pages/api/update-user-status-active.js
import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";
import { getToken } from "next-auth/jwt";

export const POST = async (req) => {
  try {
    const token = await getToken({ req });
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await dbConnect();

    const userFromDB = await User.findOne({ email: token.email });
    if (userFromDB) {
      userFromDB.activeStatus = true;
      await userFromDB.save();
      console.log("User status updated to active.");
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