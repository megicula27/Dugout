import { io } from "socket.io-client";
import {
  showInvitationNotification,
  showErrorNotification,
  showSuccessNotification,
} from "./notifications";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io("http://localhost:4000", {
      query: { userId },
    });

    // Handle incoming invitation
    this.socket.on(
      "newInvitation",
      ({
        senderId,
        receiverId,
        senderUsername,
        senderRank,
        receiverUsername,
      }) => {
        showInvitationNotification(
          `New invitation from ${senderUsername} Rank : ${senderRank}`,
          () =>
            this.respondToInvitation(
              senderId,
              receiverId,
              "ACCEPTED",
              receiverUsername
            ),
          () =>
            this.respondToInvitation(
              senderId,
              receiverId,
              "REJECTED",
              receiverUsername
            )
        );
      }
    );

    // Handle invitation sent confirmation
    this.socket.on("invitationSent", (data) => {
      showSuccessNotification(data.message);
    });

    // Handle invitation response
    this.socket.on("invitationResponse", (data) => {
      const message =
        data.status === "ACCEPTED"
          ? `${data.receiverUsername} accepted your invitation!`
          : `${data.receiverUsername} rejected your invitation.`;

      if (data.status === "ACCEPTED") {
        showSuccessNotification(message);
      } else {
        showErrorNotification(message);
      }
    });

    // Handle invitation errors
    this.socket.on("invitationError", (error) => {
      showErrorNotification(error.message);
    });

    return this.socket;
  }

  // Respond to invitation
  respondToInvitation(senderId, receiverId, status, receiverUsername) {
    if (!this.socket) {
      showErrorNotification("Socket not connected");
      return;
    }

    this.socket.emit("respondToInvitation", {
      senderId,
      receiverId,
      status,
      receiverUsername,
    });
  }

  // Send invitation
  sendInvitation(invitationData) {
    if (!this.socket) {
      showErrorNotification("Socket not connected");
      return;
    }
    this.socket.emit("sendInvitation", invitationData);
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create and export a singleton instance
export default new SocketService();
