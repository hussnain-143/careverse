// app/loading.jsx
import { Brain } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[rgb(246,244,255)] flex flex-col items-center justify-center min-h-screen px-4 z-50">
      {/* Logo + Name */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] rounded-xl" />
        <h1 className="text-2xl font-bold text-gray-900">Careverse</h1>
      </div>

      {/* Animated Brain + Ripple */}
      <div className="relative">
        <Brain
          className="w-16 h-16 text-[rgb(61,40,223)] animate-pulse"
          strokeWidth={2}
        />
        <div className="absolute inset-0 -m-4 rounded-full bg-[rgb(61,40,223)/.1] animate-ping" />
      </div>

      {/* Text */}
      <p className="mt-6 text-lg font-medium text-gray-700">
        Loading...
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Please wait a moment.
      </p>

      {/* Animated Progress Bar */}
      <div className="mt-8 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] rounded-full animate-loading-bar" />
      </div>
    </div>
  );
}