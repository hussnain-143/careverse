"use client";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { TokenManager } from "../../src/utils/tokenUtils";

const HomeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  const handleLogout = () => {
    TokenManager.clearTokens();
    setIsOpen(false);
    window.location.href = "/login";
  };

  // Update token check
  useEffect(() => {
    // Defer state updates to avoid synchronous setState-in-effect lint rule
    const t = setTimeout(() => {
      setMounted(true);
      const { token } = TokenManager.getTokens();
      setToken(token);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-xl border-b border-white/40 flex-shrink-0"
    >
      <div className="flex justify-between items-center px-6 sm:px-12 py-6 relative max-w-[1400px] mx-auto">
      {/* Logo */}
      <div>
          <Link
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-[rgb(55,0,231)] group-hover:to-[rgb(75,20,255)] transition-all duration-300">
            Careverse
          </h1>
        </Link>
      </div>

      {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="#how-it-works"
            className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition-all duration-200 relative group"
        >
          How It Works
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[rgb(55,0,231)] group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link
          href="#about"
            className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition-all duration-200 relative group"
        >
          About Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[rgb(55,0,231)] group-hover:w-full transition-all duration-300"></span>
        </Link>

        {mounted && token ? (
          <button
            onClick={handleLogout}
              className="bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] cursor-pointer hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
              className="bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Login
          </Link>
        )}
      </nav>

      {/* Mobile menu button */}
      <button
          className="md:hidden text-gray-800 focus:outline-none p-2 hover:bg-white/20 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
        aria-expanded={isOpen}
      >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
      </button>

      {/* Mobile Drawer */}
        <div
          className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl rounded-b-3xl flex flex-col items-center py-8 space-y-5 md:hidden z-50 transition-all duration-300 ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
          role="menu"
          aria-hidden={!isOpen}
        >
          <Link
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition-all duration-200 text-lg"
          >
            How It Works
          </Link>
          <Link
            href="#about"
            onClick={() => setIsOpen(false)}
            className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition-all duration-200 text-lg"
          >
            About Us
          </Link>

          {mounted && token ? (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl w-40"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl w-40 text-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
