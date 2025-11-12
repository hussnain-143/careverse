"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import LocationModal from "./LocationModal"; // Assuming this is imported correctly

const HomeMain = () => {
  const [query, setQuery] = useState("");
  // 'loc' state controls the visibility of the modal. true = location is set, false = show modal.
  const [loc, setLoc] = useState(true); 
  const router = useRouter();

  // -----------------------------
  // Function: Start Chat
  // -----------------------------
  const handleGetStarted = async (clickQuery = null) => {

    const location = localStorage.getItem("userLocation");

    // Check if location is not set (null or an empty string).
    // Note: A user's location is usually a non-empty string if set.
    if (!location || location.trim() === "") {
      // If location is missing, set state to show the modal and STOP the chat process
      setLoc(false);
    };

    

    // If location is set, continue with chat logic:
    const userQuery = clickQuery || query.trim(); 
    let messageToSend;

    // Determine the message to send
    if (userQuery === "") {
      messageToSend = "Hello, I need some general health information."; 
    } else {
      messageToSend = userQuery;
    }

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if( token== "" || !token ){
       router.push("/login");
       return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/conversations/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: messageToSend }),
        }
      );

      const data = await res.json();

      // Save conversation id
      const conversationId = data?.data?.conversation?.id;
      if (conversationId) sessionStorage.setItem("conversationId", conversationId);

      router.push("/chat");
    } catch (err) {
      console.log("network error", err);
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
    setQuery(item);          // Set query state (UI updates asynchronously)
    handleGetStarted(item);  // Immediately pass the item to start the chat
  };

  return (
    // Wrap everything in a Fragment to return a single element.
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
            className="bg-[rgb(55,0,231)] cursor-pointer hover:bg-[rgb(75,20,255)] text-white font-medium md:font-semibold py-2 px-4 md:py-3 md:px-6 rounded-full transition"
          >
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