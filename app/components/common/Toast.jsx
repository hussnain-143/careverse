"use client";
import React, { useEffect } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";
  const borderColor = isSuccess 
    ? "border-green-400/50" 
    : "border-red-400/50";
  const textColor = isSuccess 
    ? "text-green-800" 
    : "text-red-800";

  return (
    <div className={`fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-xl ${borderColor} border rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-md animate-slide-in-right`}>
      <div className="flex items-start gap-4">
        {/* icon */}
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle2 className={`w-5 h-5 ${iconColor}`} />
          ) : (
            <AlertCircle className={`w-5 h-5 ${iconColor}`} />
          )}
        </div>
        
        {/* Message */}
        <div className="flex-1">
          <p className={`text-sm font-semibold ${textColor} leading-relaxed`}>
            {message}
          </p>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-all duration-200 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

