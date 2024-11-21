import { toast } from "react-hot-toast";
import { X } from "lucide-react";
// Default Success Notification
export const showSuccessNotification = (message) => {
  toast.success(message, { duration: 3000 });
};

// Default Error Notification
export const showErrorNotification = (message) => {
  toast.error(message, { duration: 3000 });
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
