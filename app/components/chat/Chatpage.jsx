"use client";
import React, { useEffect, useState, useRef } from "react";
import { Send, Mic, Menu, Globe, Moon, User, Settings, X, Brain } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setApiData } from "../../src/store/dataSlice";

const ChatPage = () => {
  // ========== STATES ==========
  const [Sidebar, setSidebar] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ListMsg, setListMsg] = useState([]); // conversation list
  const [CurrentMsg, setCurrentMsg] = useState([]); // array of message objects
  const [topic, setTopic] = useState("");
  const [input, setInput] = useState("");
  const [popup, setPopup] = useState("");

  const router = useRouter();

  const chatScrollRef = useRef(null);
   const dispatch = useDispatch();


  // ========== HELPERS / HANDLERS ==========

  // navigate home (used by "+ New Chat" button)
  const moveHome = () => {
    router.push("/");
  };

  // send message handler
  const handleSend = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    const conversationId = sessionStorage.getItem("conversationId");
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    // 1) push user message immediately to UI
    setCurrentMsg((prev = []) => [...prev, { role: "user", content: text }]);

    // 2) push temporary assistant thinking bubble
    const thinkingId = Date.now();
    setCurrentMsg((prev = []) => [
      ...prev,
      { role: "assistant", content: "Thinking...", temp: thinkingId },
    ]);

    // 3) perform POST
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: text }),
        }
      );

      const resp = await res.json();

      // backend expected shape: resp.data.message -> { role, content } (Option A)
      // fallback: resp.data itself
      const reply = resp?.data?.message ?? resp?.data ?? null;

      if (reply) {
        // replace the thinking bubble (matched by temp id) with server reply object
        setCurrentMsg((prev = []) =>
          prev.map((m) => (m.temp === thinkingId ? reply : m))
        );
      } else {
        // no reply? remove thinking bubble and optionally add an error message
        setCurrentMsg((prev = []) => prev.filter((m) => m.temp !== thinkingId));
      }
    } catch (err) {
      console.error("network error:", err);
      // remove thinking bubble on error
      setCurrentMsg((prev = []) => prev.filter((m) => m.temp !== thinkingId));
      // optionally push an error system message:
      // setCurrentMsg(prev => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // load specific conversation when user clicks a conversation in the sidebar
  const loadSpecificConversation = async (id) => {
    if (!id) return;
    sessionStorage.setItem("conversationId", id);

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/conversations/${id}?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const msgData = await res.json();
      const data = msgData?.data ?? {};
      const { conversation, messages } = data;

      setTopic(conversation?.title ?? "");
      setCurrentMsg(messages ?? []);
    } catch (err) {
      console.error("loadSpecificConversation error:", err);
    }
  };

  // generate the assessment from conversation
  const generate_assessment = async () =>{
        const conversationId = sessionStorage.getItem("conversationId");
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/assessments/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conversationId: conversationId }),
        }
      );

      const resp = await res.json();
      if (!resp.success) {

        setPopup(resp.message);
        return;
      }
      dispatch(setApiData(resp)); 
      router.push('/assessment-results')
    } catch (err) {
      console.error("network error:", err);
      
    }

  }

  // ========== EFFECTS ==========

  // initial load: conversations list, and messages for active conversationId (if present)
  useEffect(() => {
    const loadChats = async () => {
      const conversationId = sessionStorage.getItem("conversationId");
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      try {
        // fetch conversations list
        const resList = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/conversations?page=1&limit=12`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const listData = await resList.json();
        setListMsg(listData?.data?.conversations ?? []);

        // only fetch messages if a conversationId exists
        if (conversationId) {
          const resMsg = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/conversations/${conversationId}?page=1&limit=10`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
              },
            }
          );
          const msgData = await resMsg.json();
          const data = msgData?.data ?? {};
          const { conversation, messages } = data;
          const title = conversation?.title ?? "";

          setTopic(title);
          setCurrentMsg(messages ?? []);
        } else {
          // no conversation selected — clear messages
          setCurrentMsg([]);
          setTopic("");
        }
      } catch (err) {
        console.error("loadChats error:", err);
      }
    };

    loadChats();
    // empty deps -> run once (note: dev StrictMode may call twice)
  }, []);

  // auto-scroll to bottom when messages change
 useEffect(() => {
    const scrollToBottom = () => {
      if (chatScrollRef.current) {
        requestAnimationFrame(() => {
          chatScrollRef.current.scrollTo({
            top: chatScrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        });
      }
    };

    scrollToBottom();
  }, [CurrentMsg]);

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

  useEffect(() => {
    if (popup) {
      const t = setTimeout(() => setPopup(""), 4000);
      return () => clearTimeout(t);
    }
  }, [popup]);

  // ========== SUB-COMPONENTS ==========

  const MessageBubble = ({ msg, index }) => {
    // safety defaults so render never crashes
    const role = msg?.role ?? "user";
    const content = msg?.content ?? "";

    return (
      <div
        key={index}
        className={`flex ${
          role === "assistant"
            ? "justify-start"
            : "items-start flex-row-reverse"
        } items-end gap-3 mb-8`}
        aria-live="polite"
      >
        {role === "assistant" ? (
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
            role === "assistant"
              ? "bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
              : "bg-white text-gray-800 border border-gray-100 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
          }`}
        >
          {content}
        </div>
      </div>
    );
  };

  // ========== RENDER ==========
  return (
    <div className="flex min-h-screen bg-[#f8f8ff] text-gray-800 relative">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
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
              className="w-full cursor-pointer bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] text-white font-medium py-2.5 rounded-2xl mb-6 transition hover:opacity-90"
              aria-label="New chat"
            >
              + New Chat
            </button>

            <p className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wider">
              Old Chats
            </p>

            <ul className="space-y-2 text-sm">
              {ListMsg.map((item, i) => {
                const activeId = sessionStorage.getItem("conversationId");
                const isActive = activeId === item.id;

                return (
                  <li
                    key={item.id ?? i}
                    onClick={() => loadSpecificConversation(item.id)}
                    className={`px-3 py-2 rounded-xl cursor-pointer transition truncate text-gray-700
        ${
          isActive
            ? "bg-[rgb(61,40,223)]/20 text-[rgb(61,40,223)]"
            : "hover:bg-gray-100"
        }
        `}
                  >
                    {item.title}
                  </li>
                );
              })}
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

      {/* Main content */}
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
              <Link
                href="/"
                className="text-gray-700 text-sm font-medium hover:text-[rgb(61,40,223)]"
              >
                Home
              </Link>
              <span className="text-gray-300">|</span>
              <button
                onClick={generate_assessment}
                className="text-[rgb(61,40,223)] cursor-pointer px-4 py-2 rounded-4xl border border-[rgb(61,40,223)] text-sm font-medium hover:text-white hover:bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)]"
              >
                Generate Assessment
              </button>
              <span className="text-gray-300">|</span>
            </div>
            <Globe className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[rgb(61,40,223)]" />
            <Moon className="w-5 h-5 text-gray-600 cursor-pointer hover:text-yellow-500" />
          </div>
        </header>

        {/* Chat Messages */}
          <div 
            ref={chatScrollRef} 
            className="h-[calc(100vh-140px)] overflow-y-auto py-6 px-4"
          >
          <div className="w-full max-w-screen-md mx-auto px-4">
            {CurrentMsg?.length ? (
              CurrentMsg.map((msg, index) => (
                <MessageBubble key={index} msg={msg} index={index} />
              ))
            ) : (
                <div className="relative flex justify-center">
                  <Brain
                    className="w-16 h-16 text-[rgb(61,40,223)] animate-pulse"
                    strokeWidth={2}
                  />
                  <div className="absolute inset-0 -m-4 rounded-full bg-[rgb(61,40,223)/.1] animate-ping" />
                </div>
            )}
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
              <Mic
                className="w-5 h-5 text-gray-500 cursor-pointer mr-3"
                aria-hidden
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] text-white rounded-full p-2.5 hover:opacity-90 transition"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-center text-[11px] text-gray-500 mt-3">
              Disclaimer: Careverse Assistant is for informational purposes only
              and is not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </div>
      {popup && (
  <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 z-[999]">
    <span>{popup}</span>
    <button
      onClick={() => setPopup("")}
      className="font-bold ml-2"
    >
      ×
    </button>
  </div>
)}

    </div>
  );
};

export default ChatPage;
