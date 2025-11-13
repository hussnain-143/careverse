"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import LocationModal from "./LocationModal"; // adjust path
import { apiClient } from "../../src/utils/apiClient"; // adjust path

const HomeMain = () => {
  const [query, setQuery] = useState("");
  const [loc, setLoc] = useState(true); // controls location modal
  const [send, setSend] = useState(false);
  const router = useRouter();

  // -----------------------------
  // Function: Start Chat
  // -----------------------------
  const handleGetStarted = async (clickQuery = null) => {
    setSend(true);

    const location = localStorage.getItem("userLocation");

    if (!location || location.trim() === "") {
      setLoc(false);
      setSend(false);
      return;
    }

    const userQuery = clickQuery || query.trim();
    const messageToSend =
      userQuery === ""
        ? "Hello, I need some general health information."
        : userQuery;

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      router.push("/login");
      setSend(false);
      return;
    }

    try {
      const res = await apiClient.post("/api/v1/chat/conversations/start", {
        message: messageToSend,
      });

      // Save conversation id
      const conversationId = res?.data?.conversation?.id;
      if (conversationId) sessionStorage.setItem("conversationId", conversationId);

      setSend(false);
      router.push("/chat");
    } catch (err) {
      setSend(false);
      console.error("network error", err);
    }
  };

  // -----------------------------
  // Function: handle Enter key
  // -----------------------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleGetStarted();
  };

  // -----------------------------
  // Function: handle suggestion click
  // -----------------------------
  const handleQueryClick = (item) => {
    setQuery(item);
    handleGetStarted(item);
  };

  return (
    <>
      {/* Conditional Rendering of LocationModal */}
      {loc === false && <LocationModal />}

      <main className="flex flex-col items-center text-center px-6 py-10 sm:py-20">
        <h2 className="text-xl sm:text-6xl font-extrabold max-w-full leading-tight mb-6 text-gray-900">
          Every kind of care made simple and accessible for all people, anywhere
          in the world.
        </h2>

        <p className="text-gray-800 max-w-2xl mb-8 text-base sm:text-lg">
          Ask me anything about your symptoms, finding care, or exploring health
          options.
        </p>

        <div className="bg-[rgb(55,0,231)]/10 text-[rgb(55,0,231)] px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm items-center gap-2 inline-flex">
          <Sparkles className="w-5 h-5 text-[rgb(55,0,231)] animate-pulse" />{" "}
          Powered by GPT
        </div>

        {/* Search Bar */}
        <div className="bg-white flex items-center rounded-full shadow-lg overflow-hidden w-full max-w-2xl mb-8 p-1 md:p-2 gap-2">
          <input
            type="text"
            placeholder="Tell me what’s wrong or what you’re looking for..."
            value={query}
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-2 w-10 md:w-full md:px-5 py-3 text-gray-800 focus:outline-none"
          />
          <button
            onClick={() => handleGetStarted()}
            disabled={send}
            className={`bg-[rgb(55,0,231)] cursor-pointer hover:bg-[rgb(75,20,255)] text-white font-medium md:font-semibold py-2 px-4 md:py-3 md:px-6 rounded-full transition flex items-center justify-center gap-2 ${
              send ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {send ? (
              <div className="size-5 border border-white rounded-full border-b-transparent animate-spin"></div>
            ) : (
              "Get Started"
            )}
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
              onClick={() => handleQueryClick(item)}
              className="bg-[rgb(221,232,248)] text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-[rgb(55,0,231)]/10 cursor-pointer hover:text-gray-900 transition"
            >
              {item}
            </span>
          ))}
        </div>
      </main>
    </>
  );
};

export default HomeMain;