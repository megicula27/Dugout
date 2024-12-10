"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import socketService from "@/utils/SocketIO/socketIOClient";

const ChangeStatusOnUnload = () => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user?.id) {
      const socket = socketService.connect(session.user.id);

      socket.emit("register", session.user.uid);

      // Cleanup on unmount
      return () => {
        socketService.disconnect();
      };
    }
  }, [session]);
  useEffect(() => {
    const updateUserActiveStatus = async () => {
      if (session) {
        //TODO: Update user's active status to true when the app loads and session is active
        await axios.post("/api/auth/changeToOnline");
      }
    };

    updateUserActiveStatus();
  }, [session]);

  return null;
};

export default ChangeStatusOnUnload;
