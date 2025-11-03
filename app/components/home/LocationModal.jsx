"use client";
import React, { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";

export default function LocationModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (!saved) setShow(true);
  }, []);

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          localStorage.setItem("userLocation", JSON.stringify(location));
          setShow(false);
        },
        () => alert("Unable to retrieve location.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleManual = () => (window.location.href = "/enter-location");

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        {/* Close */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-[rgb(55,0,231)]/10 text-[rgb(55,0,231)] rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
          Enable Location Services
        </h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          To find the best local providers and services for you, Careverse needs
          to know your location.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleAllow}
            className="w-full bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-3 rounded-full transition"
          >
            Allow Location Access
          </button>
          <button
            onClick={handleManual}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-full transition"
          >
            Enter Manually
          </button>
        </div>
      </div>
    </div>
  );
}
