// signOutUtils.js
"use client";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const handleSignOut = async () => {
  try {
    await signOut({ callbackUrl: "/" });
    toast.success("You have signed out successfully!");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
export default handleSignOut;
