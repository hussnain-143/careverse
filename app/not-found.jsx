"use client";
import React from "react";
import { ArrowRight, Home, Search, Compass } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[rgb(120,195,235)] via-[rgb(150,177,225)] to-[rgb(180,159,216)] relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[rgb(55,0,231)]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[rgb(75,20,255)]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[rgb(120,195,235)]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-20 w-64 h-64 bg-[rgb(55,0,231)]/8 rounded-full blur-2xl animate-float"></div>
                <div className="absolute bottom-40 left-20 w-56 h-56 bg-[rgb(75,20,255)]/8 rounded-full blur-2xl animate-float delay-500"></div>
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
                <div className="w-full max-w-2xl">
                    {/* Modern Split Layout */}
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left Side - 404 Number */}
                        <div className="text-center md:text-left animate-fade-in-up">
                            <div className="relative inline-block">
                                <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-[rgb(55,0,231)] via-[rgb(75,20,255)] via-[rgb(120,195,235)] to-[rgb(75,20,255)] bg-clip-text text-transparent tracking-tight animate-gradient bg-[length:200%_auto] hero-glow leading-none">
                        404
                    </h1>
                                {/* Decorative elements */}
                                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[rgb(55,0,231)]/20 to-[rgb(75,20,255)]/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-[rgb(75,20,255)]/20 to-[rgb(55,0,231)]/20 rounded-full blur-xl animate-pulse delay-500"></div>
                            </div>
                        </div>

                        {/* Right Side - Content */}
                        <div className="space-y-6 animate-fade-in-up delay-200">
                            {/* Icon */}
                            <div className="flex justify-center md:justify-start mb-6">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-2xl shadow-xl flex items-center justify-center animate-float-slow">
                                        <Compass className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-2xl opacity-30 blur-2xl animate-pulse"></div>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                Lost in Space?
                    </h2>

                    {/* Message */}
                            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                                The page you're looking for seems to have drifted away. Let's get you back on track.
                    </p>

                    {/* Button */}
                            <div className="pt-4">
                    <a
                        href="/"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group"
                    >
                                    <Home className="w-4 h-4" />
                        Go Back Home
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </a>
                            </div>

                            {/* Decorative line */}
                            <div className="pt-4">
                                <div className="w-20 h-1 bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Floating decorative elements */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[rgb(55,0,231)]/30 rounded-full animate-float delay-300"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-[rgb(75,20,255)]/30 rounded-full animate-float delay-700"></div>
                </div>
            </div>
        </div>
    );
}
