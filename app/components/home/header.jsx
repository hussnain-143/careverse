"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const HomeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  // get token from any storage
  const token =
    typeof window !== "undefined" &&
    (localStorage.getItem("authToken") || sessionStorage.getItem("authToken"));

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setIsOpen(false);
    window.location.href = "/login";
  };

  return (
    <>
      <header className="flex justify-between items-center px-6 sm:px-12 py-6 relative">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-[rgb(55,0,231)] rounded-full shadow-sm"></div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Careverse
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="#how-it-works"
            className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition"
          >
            How It Works
          </Link>
          <Link
            href="#about"
            className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition"
          >
            About Us
          </Link>

          {token ? (
            <button
              onClick={handleLogout}
              className="bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-2 px-5 rounded-full transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-2 px-5 rounded-full transition"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-b-2xl flex flex-col items-center py-6 space-y-4 md:hidden z-50">
            <Link
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition"
            >
              How It Works
            </Link>
            <Link
              href="#about"
              onClick={() => setIsOpen(false)}
              className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition"
            >
              About Us
            </Link>

            {token ? (
              <button
                onClick={handleLogout}
                className="bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-2 px-5 rounded-full transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-2 px-5 rounded-full transition"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default HomeHeader;
