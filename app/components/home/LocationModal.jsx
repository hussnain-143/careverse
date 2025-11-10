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
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    console.log(lat);
    console.log(lon);


    try {
      // reverse geocode call
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

      // save locally
      localStorage.setItem("userLocation", JSON.stringify(finalData));
      setShow(false);

      // send to backend if user login
      const token =
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      if (token) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/location`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(finalData),
          }
        );
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong while getting location data");
    }
  });
};

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
        </div>
      </div>
    </div>
  );
}
