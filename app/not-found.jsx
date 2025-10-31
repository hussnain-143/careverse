"use client";
import React from "react";

export default function NotFoundPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[rgb(120,195,235)] to-[rgb(180,159,216)] px-4">
            {/* Card */}
            <div className="bg-[rgb(221,232,248)] backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-md">
                {/* Icon */}
                <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[rgb(55,0,231)] mb-4 animate-bounce"></div>

                    {/* Animated 404 */}
                    <h1 className="text-[4rem] font-extrabold text-[rgb(55,0,231)] tracking-tight drop-shadow-sm animate-pulse">
                        404
                    </h1>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Page Not Found
                    </h2>

                    {/* Message */}
                    <p className="text-gray-700 mb-8 leading-relaxed">
                        Oops! The page you’re looking for doesn’t exist or has been moved.
                    </p>

                    {/* Button */}
                    <a
                        href="/"
                        className="inline-block bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-2.5 px-8 rounded-full transition-all duration-200 "
                    >
                        Go Back Home
                    </a>
                </div>
            </div>
        </div>
    );
}
