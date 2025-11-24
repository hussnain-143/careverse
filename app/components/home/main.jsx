"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Search, ArrowRight, Stethoscope, Heart, Pill, Activity, Users, MapPin, Shield, Clock, Globe, Zap, MessageCircle, CheckCircle2 } from "lucide-react";
import LocationModal from "./LocationModal";
import { apiClient } from "../../src/utils/apiClient";

const HomeMain = () => {
  const [query, setQuery] = useState("");
  const [loc, setLoc] = useState(true);
  const [send, setSend] = useState(false);
  const router = useRouter();

  const handleGetStarted = async (clickQuery = null) => {
    if (send) return;
    
    setSend(true);

    const location = localStorage.getItem("userLocation");

    if (!location || location.trim() === "") {
      setLoc(false);
      setSend(false);
      return;
    }

    const userQuery = clickQuery !== null ? clickQuery : (query || "");
    const messageToSend = userQuery.trim() === ""
      ? "Hello, I need some general health information."
      : userQuery.trim();

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      setSend(false);
      router.push("/login");
      return;
    }

    try {
      const res = await apiClient.post("/api/v1/chat/conversations/start", {
        message: messageToSend,
      });

      const conversationId = res?.data?.conversation?.id;
      if (conversationId) sessionStorage.setItem("conversationId", conversationId);

      setTimeout(() => {
        setSend(false);
        router.push("/chat");
      }, 300);
    } catch (err) {
      setSend(false);
      console.error("network error", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleGetStarted();
  };

  const handleQueryClick = (item) => {
    setQuery(item);
    handleGetStarted(item);
  };

  return (
    <>
      {loc === false && <LocationModal />}

      <main className="flex flex-col items-center text-center px-6 py-12 sm:py-20 lg:py-10">
        {/* Badge */}
        <div className="mb-6 animate-fade-in">
          <div className="bg-white/60 backdrop-blur-xl text-[rgb(55,0,231)] px-5 py-2 rounded-full text-sm font-semibold shadow-lg items-center gap-2 inline-flex border border-[rgb(55,0,231)]/20">
            <Sparkles className="w-4 h-4 text-[rgb(55,0,231)] animate-pulse" />
            Powered by GPT
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="font-black w-full max-w-5xl mx-auto leading-[1.1] mb-8 text-gray-900 tracking-tight text-3xl sm:text-4xl lg:text-5xl">
            <span className="inline-block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent hero-text-shadow">
              Every kind of care
            </span>
            <span className="relative mx-2 inline-block bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] bg-clip-text text-transparent hero-glow">
              made simple 
            </span>
            <br/>
            <span className="inline-block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent hero-text-shadow">
              and accessible
            </span>
          <div className="font-bold mt-6 sm:mt-8 opacity-90 text-lg sm:text-xl lg:text-2xl">
            <span className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-clip-text text-transparent">
              for all people, anywhere in the world
            </span>
          </div>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-700 max-w-2xl mb-12 text-base sm:text-lg lg:text-xl font-medium animate-fade-in-up delay-100">
          Ask me anything about your symptoms, finding care, or exploring health
          options.
        </p>

        {/*Search Bar */}
        <div className="w-full max-w-3xl mb-10 animate-fade-in-up delay-200">
          <div className="bg-white/80 backdrop-blur-xl flex items-center rounded-2xl shadow-2xl overflow-hidden border border-white/50 p-2 gap-2 hover:shadow-3xl transition-all duration-300 focus-within:border-white/50 focus-within:shadow-2xl">
            <div className="pl-4 pr-2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tell me what's wrong or what you're looking for..."
              value={query}
              onKeyDown={handleKeyDown}
              onChange={(e) => setQuery(e.target.value)}
              disabled={send}
              className="flex-1 px-2 py-4 text-gray-800 focus:outline-none focus:ring-0 border-0 bg-transparent placeholder:text-gray-400 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Search for health information"
            />
            <button
              onClick={() => handleGetStarted()}
              disabled={send}
              className={`bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] cursor-pointer hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white font-semibold py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg ${
                send ? "opacity-70 cursor-not-allowed" : ""
              }`}
              aria-label="Get started with your health query"
            >
              {send ? (
                <div className="size-5 border-2 border-white rounded-full border-b-transparent animate-spin"></div>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-5xl animate-fade-in-up delay-300">
          <p className="text-sm text-gray-600 mb-6 font-semibold uppercase tracking-wider">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                text: "Find a doctor for my headaches", 
                icon: Stethoscope
              },
              { 
                text: "I have a skin rash, what could it be?", 
                icon: Activity
              },
              { 
                text: "Therapists near me that take my insurance", 
                icon: Heart
              },
              { 
                text: "What are the symptoms of the flu?", 
                icon: Pill
              },
              { 
                text: "Find a local dentist for a check-up", 
                icon: Users
              },
              { 
                text: "Low-cost clinics in my area", 
                icon: MapPin
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQueryClick(item.text)}
                  disabled={send}
                  className="group relative bg-white/70 backdrop-blur-xl text-gray-800 px-6 py-4 rounded-2xl text-sm font-medium cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl border border-white/60 hover:border-[rgb(55,0,231)]/40 hover:scale-[1.02] active:scale-[0.98] text-left overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                  aria-label={`Quick action: ${item.text}`}
                >
                  {/* Single color gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)]/10 to-[rgb(75,20,255)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-start gap-3">
                    <div className="mt-0.5 p-2 bg-gradient-to-br from-[rgb(55,0,231)]/10 to-[rgb(75,20,255)]/10 rounded-lg group-hover:from-[rgb(55,0,231)]/20 group-hover:to-[rgb(75,20,255)]/20 transition-all duration-300">
                      <Icon className="w-4 h-4 text-[rgb(55,0,231)] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="flex-1 text-gray-800 group-hover:text-[rgb(55,0,231)] transition-colors duration-300 font-medium leading-snug">
                      {item.text}
                    </span>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4 text-[rgb(55,0,231)]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Information Grid */}
        <div className="w-full max-w-6xl mt-24 mb-10 animate-fade-in-up delay-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Instant Responses",
                description: "Get immediate answers to your health questions powered by advanced AI technology.",
                iconGradient: "from-yellow-400 to-orange-500"
              },
              {
                icon: Shield,
                title: "Privacy Protected",
                description: "Your health information is kept secure and confidential with enterprise-grade encryption.",
                iconGradient: "from-green-400 to-emerald-500"
              },
              {
                icon: Globe,
                title: "Global Access",
                description: "Access healthcare information and find providers anywhere in the world, 24/7.",
                iconGradient: "from-blue-400 to-cyan-500"
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Get help whenever you need it, day or night, without waiting for office hours.",
                iconGradient: "from-purple-400 to-pink-500"
              },
              {
                icon: MessageCircle,
                title: "AI-Powered Chat",
                description: "Have natural conversations with our AI assistant about your health concerns.",
                iconGradient: "from-indigo-400 to-purple-500"
              },
              {
                icon: CheckCircle2,
                title: "Verified Information",
                description: "All health information is verified and sourced from trusted medical databases.",
                iconGradient: "from-teal-400 to-blue-500"
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white/75 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl border border-white/50 hover:border-[rgb(55,0,231)]/30 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                >
                  {/* Subtle gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)]/5 to-[rgb(75,20,255)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-4 flex items-center gap-4">
                      <div className={`p-3 bg-gradient-to-br ${item.iconGradient} rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[rgb(55,0,231)] transition-colors duration-300 flex-1">
                        {item.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed pl-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default HomeMain;