import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CustomAlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export function CustomAlert({ message, type, onClose }: CustomAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

return (
    <div
        className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${
            type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}
    >
        <div className="flex items-center justify-between">
            <p>{message}</p>
            <button onClick={() => setIsVisible(false)} className="ml-4" title="Close">
                <X size={16} />
            </button>
        </div>
    </div>
);
}
