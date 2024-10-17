// components/ToastContext.tsx
"use client"; // Required if using app directory in Next.js 13+

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

// Types for Toast and Toast Context
type ToastType = "success" | "error" | "info";

interface Toast {
  id?: number;
  loading: boolean;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (toast: Toast) => void;
  toasts: Toast;
}

// Create the Toast Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook to use the Toast context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Props for ToastProvider
interface ToastProviderProps {
  children: ReactNode;
}

const defaultToast: Toast = {
  message: "",
  loading: false,
  type: "success",
  // operationType: 'form'
};

// ToastProvider Component
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast>(defaultToast);

  // Function to add a new toast
  const addToast = useCallback(({ loading, message, type = "info" }: Toast) => {
    setToasts({ loading, message, type });

    // Automatically remove the toast after 3 seconds
    setTimeout(() => removeToast(), 3000);
  }, []);

  // Function to remove a toast by ID
  const removeToast = useCallback(() => {
    setToasts(defaultToast);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, toasts }}>
      {children}
      {/* Toast Container */}
      <div className="fixed right-5 top-5 space-y-2">
        {toasts.message && (
          <div
            className={`rounded p-4 text-white shadow-lg ${
              toasts.type === "success"
                ? "bg-green-500"
                : toasts.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
            }`}
          >
            {toasts.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
};
