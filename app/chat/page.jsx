"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Mic,
  Menu,
  Globe,
  Moon,
  User,
  Settings,
  X,
} from "lucide-react";

const ChatPage = () => {
  const params = useSearchParams();
  const [Sidebar, setSidebar] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const topic = params.get("topic") || "Frequent Headaches";

  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Hello! I'm the Careverse Assistant. How are things feeling today?",
    },
    { sender: "user", text: "I've been having frequent headaches lately." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMessage = { sender: "user", text: input.trim() };
    const assistantResponse = {
      sender: "assistant",
      text: "I'm sorry to hear that. Could you provide more detail? Where is the pain located?",
    };

    setMessages((prev) => [...prev, newUserMessage, assistantResponse]);
    setInput("");
  };

  const moveHome = () => {
    window.location.href = "/";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    const chatWindow = document.getElementById("chat-messages");
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  // prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const MessageBubble = ({ msg, index }) => (
    <div
      key={index}
      className={`flex ${msg.sender === "assistant" ? "justify-start" : "items-start flex-row-reverse"} items-end gap-3 mb-8`}
      aria-live="polite"
    >
      {msg.sender === "assistant" ? (
        <div className="flex flex-col items-start gap-2">
          <span className="text-xs text-gray-500">Careverse</span>
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Careverse"
            alt="Assistant avatar"
            className="w-9 h-9 rounded-full border border-gray-200 shadow-sm"
          />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-2">
          <span className="text-xs text-gray-500">You</span>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 border border-gray-200" />
        </div>
      )}

      <div
        className={`px-5 py-3 max-w-[65%] text-[15px] leading-relaxed shadow-sm break-words ${
          msg.sender === "assistant"
            ? "bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
            : "bg-white text-gray-800 border border-gray-100 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f8ff] text-gray-800 relative">
      {/* Sidebar for md+ (fixed) and mobile (sliding) */}
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          aria-hidden="true"
        />
      )}

<aside
  className={`flex flex-col w-64 border-r border-gray-200 bg-white justify-between fixed top-0 left-0 h-full z-40 transform transition-transform duration-300
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    ${Sidebar ? "md:translate-x-0" : "md:-translate-x-full"}
  `}
>
        <div>
          <div className="flex items-center gap-2 mb-8 justify-between px-6 mt-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] rounded-md" />
              <h1 className="font-semibold text-xl text-gray-900">Careverse</h1>
            </div>
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="px-6">
            <button
              onClick={moveHome}
              className="w-full bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] text-white font-medium py-2.5 rounded-2xl mb-6 transition hover:opacity-90"
              aria-label="New chat"
            >
              + New Chat
            </button>

            <p className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wider">
              Old Chats
            </p>

            <ul className="space-y-2 text-sm">
              {[
                "Frequent Headaches",
                "Skin Rash Inquiry",
                "Managing Stress & Anxiety",
                "Cold Symptom Check",
              ].map((item, i) => (
                <li
                  key={i}
                  className={`px-3 py-2 rounded-xl cursor-pointer transition truncate ${
                    item === topic
                      ? "bg-[rgb(61,40,223)]/10 text-[rgb(61,40,223)] font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t py-4 px-6 text-left">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-3 mt-1.5">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-300 to-gray-200">
              <User className="w-5 h-5 text-white/90" />
            </div>
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </div>

          {/* Settings Button */}
          <button
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[rgb(61,40,223)] mt-1 w-full text-left p-2 rounded-lg hover:bg-gray-100"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main content container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          Sidebar ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <header className="flex justify-between items-center pb-4 px-6 pt-3 border-b bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                // open sidebar on mobile; toggle on md
                if (window.innerWidth < 768) {
                  setMobileOpen(true);
                } else {
                  setSidebar((s) => !s);
                }
              }}
              className="cursor-pointer p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-gray-500" />
            </button>
            <h2 className="text-[17px] font-semibold text-gray-900">{topic}</h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <a
                href="/"
                className="text-gray-700 text-sm font-medium hover:text-[rgb(61,40,223)]"
              >
                Home
              </a>
              <span className="text-gray-300">|</span>
            </div>
            <Globe className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[rgb(61,40,223)]" />
            <Moon className="w-5 h-5 text-gray-600 cursor-pointer hover:text-yellow-500" />
          </div>
        </header>

        {/* Chat Messages */}
        <div id="chat-messages" className="flex-1 overflow-y-auto py-6 px-4">
          <div className="w-full max-w-screen-md mx-auto px-4">
            {messages.map((msg, index) => (
              <MessageBubble key={index} msg={msg} index={index} />
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4 sticky bottom-0">
          <div className="w-full max-w-screen-md mx-auto px-4">
            <div className="flex items-center w-full bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what’s wrong or ask about a symptom..."
                className="flex-1 bg-transparent focus:outline-none px-2 text-gray-800 placeholder-gray-400 text-sm"
                aria-label="Message input"
              />
              <Mic className="w-5 h-5 text-gray-500 cursor-pointer mr-3" aria-hidden />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] text-white rounded-full p-2.5 hover:opacity-90 transition"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[11px] text-gray-500 mt-3">
              Disclaimer: Careverse Assistant is for informational purposes only and is not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
