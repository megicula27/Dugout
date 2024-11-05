"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const ChangeStatusOnUnload = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const updateUserActiveStatus = async () => {
      if (session) {
        // Update user's active status to true when the app loads and session is active
        await axios.post("/api/auth/changeToOnline");
      }
    };

    updateUserActiveStatus();
  }, [session]);

  return null;
};

export default ChangeStatusOnUnload;
