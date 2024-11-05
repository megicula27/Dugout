"use client";
import { useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const ChangeStatusOnUnload = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      // Prevent the default behavior of the event
      event.preventDefault();

      if (session) {
        try {
          // Make an API call to update active status to false
          await axios.post("/api/auth/changeToOffline");
          console.log("User status set to inactive on unload.");
        } catch (error) {
          console.error("Failed to update user status on unload:", error);
        }
      }
    };

    // Add event listener for beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [session]);

  return null; // This component doesn't render anything
};

export default ChangeStatusOnUnload;
