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
        } bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg`}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm">{message}</p>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-white hover:text-blue-100"
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
