"use client";
import React from "react";

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[rgb(120,195,235)] to-[rgb(180,159,216)] text-gray-900">
            <div className="flex flex-col max-w-[1200px] mx-auto min-h-screen">
                          {/* Navbar */}
            <header className="flex justify-between items-center px-6 sm:px-12 py-6">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[rgb(55,0,231)] rounded-full shadow-sm"></div>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Careverse
                    </h1>
                </div>

                <nav className="flex items-center space-x-6">
                    <a href="#how-it-works" className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition">
                        How It Works
                    </a>
                    <a href="#about" className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition">
                        About Us
                    </a>
                    <a
                        href="/login"
                        className="bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-2 px-5 rounded-full transition"
                    >
                        Login
                    </a>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="flex flex-col items-center text-center px-6 py-10 sm:py-20">
                <h2 className="text-3xl sm:text-5xl font-extrabold max-w-3xl leading-tight mb-6 text-gray-900">
                    Every kind of care made simple and accessible for all people,
                    anywhere in the world.
                </h2>

                <p className="text-gray-800 max-w-2xl mb-8 text-base sm:text-lg">
                    Ask me anything about your symptoms, finding care, or exploring
                    health options.
                </p>

                {/* GPT Badge */}
                <div className="bg-[rgb(221,232,248)] text-[rgb(55,0,231)] px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm">
                    ⚡ Powered by GPT
                </div>

                {/* Search Bar */}
                <div className="bg-white flex items-center rounded-full shadow-lg overflow-hidden w-full max-w-xl mb-8">
                    <input
                        type="text"
                        placeholder="Tell me what’s wrong or what you’re looking for..."
                        className="flex-1 px-5 py-3 text-gray-800 focus:outline-none"
                    />
                    <button className="bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-3 px-6 rounded-full transition">
                        Get Started
                    </button>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
                    {[
                        "Find a doctor for my headaches",
                        "I have a skin rash, what could it be?",
                        "Therapists near me that take my insurance",
                        "What are the symptoms of the flu?",
                        "Find a local dentist for a check-up",
                        "Low-cost clinics in my area",
                    ].map((item, index) => (
                        <span
                            key={index}
                            className="bg-[rgb(221,232,248)] text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-[rgb(180,159,216)] hover:text-gray-900 transition"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-6 text-sm text-gray-800 bg-transparent">
                <div className="flex justify-center gap-6 mb-2">
                    <a href="#" className="hover:text-[rgb(55,0,231)] transition">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:text-[rgb(55,0,231)] transition">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-[rgb(55,0,231)] transition">
                        Contact Us
                    </a>
                </div>
                <p className="text-gray-700 text-xs">
                    © {new Date().getFullYear()} Careverse. This is an AI-driven tool and
                    not a substitute for professional medical advice.
                </p>
            </footer>
            </div>
        </div>
    );
}
