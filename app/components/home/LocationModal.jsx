"use client";
import React, { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { apiClient } from "../../src/utils/apiClient";

export default function LocationModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (!saved) setShow(true);
  }, []);

  const handleAllow = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const geoRes = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${process.env.NEXT_PUBLIC_GEOCODE_KEY}`
        );
        const geoData = await geoRes.json();
        const comp = geoData.results[0].components;

        const finalData = {
          latitude: lat,
          longitude: lon,
          city: comp.city || comp.town || comp.village || "",
          state: comp.state || "",
          country: comp.country || "",
          countryCode: comp["ISO_3166-1_alpha-2"] || "",
        };

        localStorage.setItem("userLocation", JSON.stringify(finalData));
        setShow(false);

        const token =
          localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

        if (token) {
          await apiClient.patch('/api/v1/users/location', finalData);
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong while getting location data");
      }
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 px-4 animate-fade-in">
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-scale-in border border-white/50">
        {/* Close */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-all duration-200 p-1.5 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-2xl opacity-0 blur-xl animate-pulse"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          Enable Location Services
        </h2>
        <p className="text-gray-600 mb-8 text-base leading-relaxed">
          To find the best local providers and services for you, Careverse needs
          to know your location.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleAllow}
            className="w-full bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Allow Location Access
          </button>
          <button
            onClick={() => setShow(false)}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2.5 transition-colors duration-200"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
