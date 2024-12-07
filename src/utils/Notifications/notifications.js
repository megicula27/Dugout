import { toast } from "react-hot-toast";
import "@/styles/tournamentWarning.css";
// Default Success Notification
export const showSuccessNotification = (message, duration = 3000) => {
  toast.success(message, {
    duration,
    style: {
      background: "#4CAF50",
      color: "white",
    },
  });
};

// Default Error Notification
export const showErrorNotification = (message, duration = 3000) => {
  toast.error(message, {
    duration,
    style: {
      background: "#F44336",
      color: "white",
    },
  });
};

// Custom Invitation Notification
export const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded text-sm font-medium focus:outline-none ${className}`}
  >
    {children}
  </button>
);

// Custom notification for invitations
export const showInvitationNotification = (message, onAccept, onReject) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{message}</p>
            </div>
          </div>
          <div className="mt-4 flex">
            <Button
              onClick={() => {
                onAccept && onAccept();
                toast.dismiss(t.id);
              }}
              className="mr-2 bg-green-500 text-white"
            >
              Accept
            </Button>
            <Button
              onClick={() => {
                onReject && onReject();
                toast.dismiss(t.id);
              }}
              className="bg-red-500 text-white"
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    ),
    { duration: Infinity }
  );
};
export const showCustomNotification = (message) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "opacity-100" : "opacity-0"
        } bg-yellow-500 text-black px-6 py-4 rounded-lg shadow-lg flex items-center`}
      >
        <div className="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex items-center justify-between gap-4 flex-grow">
          <p className="text-sm">{message}</p>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-black hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    ),
    {
      position: "bottom-right",
      duration: 3000,
    }
  );
};
const TournamentNotification = ({ message }) => (
  <div style={{ display: "flex", alignItems: "center", color: "#b59f3b" }}>
    <span style={{ marginRight: "10px", fontSize: "24px" }}>⚠️</span>
    <span>{message}</span>
  </div>
);
export const showTournamentWarning = (message) => {
  toast.custom(
    (t) => (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          backgroundColor: "#FFFBE6",
          border: "1px solid #FFD700",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "300px",
          animation: t.visible ? "fadeIn 0.5s" : "fadeOut 0.5s",
        }}
      >
        <TournamentNotification message={message} />
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            marginLeft: "10px",
            backgroundColor: "transparent",
            border: "none",
            color: "#b59f3b",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          ✖
        </button>
      </div>
    ),
    {
      duration: Infinity,
      position: "bottom-right",
    }
  );
};
